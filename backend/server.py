from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class IncomeSource(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    amount: float

class MonthlyBudget(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    month: str
    year: int
    income_sources: List[IncomeSource]
    total_income: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MonthlyBudgetCreate(BaseModel):
    month: str
    year: int
    income_sources: List[IncomeSource]

class Expense(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    amount: float
    category: str
    note: Optional[str] = None
    date: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExpenseCreate(BaseModel):
    amount: float
    category: str
    note: Optional[str] = None
    date: str

class AIAdviceRequest(BaseModel):
    money_left: float
    days_left: int
    burn_rate: float
    safe_daily_spend: float
    expenses: List[dict]
    total_income: float
    total_spent: float

class AIAdviceResponse(BaseModel):
    advice: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "SmartSaveAI API"}

@api_router.post("/budget", response_model=MonthlyBudget)
async def create_budget(budget_input: MonthlyBudgetCreate):
    total = sum(source.amount for source in budget_input.income_sources)
    budget_obj = MonthlyBudget(
        month=budget_input.month,
        year=budget_input.year,
        income_sources=budget_input.income_sources,
        total_income=total
    )
    
    doc = budget_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['income_sources'] = [source.model_dump() for source in budget_obj.income_sources]
    
    await db.budgets.insert_one(doc)
    return budget_obj

@api_router.get("/budget/{month}/{year}", response_model=MonthlyBudget)
async def get_budget(month: str, year: int):
    budget = await db.budgets.find_one({"month": month, "year": year}, {"_id": 0})
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    if isinstance(budget['created_at'], str):
        budget['created_at'] = datetime.fromisoformat(budget['created_at'])
    
    return budget

@api_router.post("/expenses", response_model=Expense)
async def create_expense(expense_input: ExpenseCreate):
    expense_obj = Expense(
        amount=expense_input.amount,
        category=expense_input.category,
        note=expense_input.note,
        date=expense_input.date
    )
    
    doc = expense_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.expenses.insert_one(doc)
    return expense_obj

@api_router.get("/expenses/{month}/{year}", response_model=List[Expense])
async def get_expenses(month: str, year: int):
    expenses = await db.expenses.find({}, {"_id": 0}).to_list(1000)
    
    filtered_expenses = []
    for exp in expenses:
        exp_date = exp['date']
        if isinstance(exp['created_at'], str):
            exp['created_at'] = datetime.fromisoformat(exp['created_at'])
        
        if exp_date.startswith(f"{year}-{month.zfill(2)}"):
            filtered_expenses.append(exp)
    
    return filtered_expenses

@api_router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: str):
    result = await db.expenses.delete_one({"id": expense_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted"}

@api_router.post("/ai-advice", response_model=AIAdviceResponse)
async def get_ai_advice(request: AIAdviceRequest):
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    category_breakdown = {}
    for exp in request.expenses:
        cat = exp.get('category', 'Other')
        category_breakdown[cat] = category_breakdown.get(cat, 0) + exp.get('amount', 0)
    
    total_spent = sum(category_breakdown.values())
    
    category_percentages = {}
    if total_spent > 0:
        for cat, amount in category_breakdown.items():
            category_percentages[cat] = (amount / total_spent) * 100
    
    prompt = f"""You are SmartSave Bot, a savage but helpful financial coach for students. Give SHORT, casual advice (2-3 sentences max).

Student's situation:
- Money left: €{request.money_left:.2f}
- Days until month ends: {request.days_left}
- Burn rate (per day): €{request.burn_rate:.2f}
- Safe daily spend: €{request.safe_daily_spend:.2f}
- Total income this month: €{request.total_income:.2f}
- Total spent: €{request.total_spent:.2f}
- Category breakdown: {category_percentages}

Tone: Friendly, casual, Gen Z, slightly savage but motivating. Not banking language.
Examples: "Chill today. Budget is tight.", "Legend. You stayed under budget.", "Bro... food again?", "You can safely spend €7 today."

Give advice now:"""
    
    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=str(uuid.uuid4()),
            system_message="You are a savage but helpful financial coach for students. Keep responses SHORT (2-3 sentences). Use casual, Gen Z language."
        )
        chat.with_model("openai", "gpt-5.2")
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        return AIAdviceResponse(advice=response)
    except Exception as e:
        logging.error(f"AI advice error: {e}")
        return AIAdviceResponse(advice="Can't connect to AI right now. Keep it tight, you got this! 💪")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()