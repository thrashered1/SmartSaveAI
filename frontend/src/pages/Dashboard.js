import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingDown, Calendar, Zap, Plus, Sparkles, PieChart, ArrowDownCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import ExpenseList from '../components/ExpenseList';
import CategoryBreakdown from '../components/CategoryBreakdown';
import AIAssistant from '../components/AIAssistant';
import AddIncomeModal from '../components/AddIncomeModal';
import StreakTracker from '../components/gamification/StreakTracker';
import HealthScore from '../components/gamification/HealthScore';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORIES = [
  { name: 'Food', icon: '\ud83c\udf54', color: 'from-red-500 to-orange-500' },
  { name: 'Transport', icon: '\ud83d\ude97', color: 'from-blue-500 to-cyan-500' },
  { name: 'Rent', icon: '\ud83c\udfe0', color: 'from-green-500 to-emerald-500' },
  { name: 'Fun', icon: '\ud83c\udf89', color: 'from-pink-500 to-rose-500' },
  { name: 'Shopping', icon: '\ud83d\uded2', color: 'from-purple-500 to-violet-500' },
  { name: 'Other', icon: '\ud83d\udce6', color: 'from-gray-500 to-slate-500' },
];

export default function Dashboard({ onShowExpenseModal }) {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Listen for add expense trigger from bottom nav
  useEffect(() => {
    const handleShowModal = () => setShowExpenseModal(true);
    window.addEventListener('openExpenseModal', handleShowModal);
    return () => window.removeEventListener('openExpenseModal', handleShowModal);
  }, []);
  
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Food',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const budgetRes = await axios.get(`${API}/budget/${currentMonth}/${currentYear}`);
      setBudget(budgetRes.data);
      
      const expensesRes = await axios.get(`${API}/expenses/${currentMonth}/${currentYear}`);
      setExpenses(expensesRes.data);
    } catch (error) {
      if (error.response?.status === 404) {
        navigate('/onboarding');
      }
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async () => {
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    try {
      const res = await axios.post(`${API}/expenses`, {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      
      setExpenses([...expenses, res.data]);
      setNewExpense({ amount: '', category: 'Food', note: '', date: new Date().toISOString().split('T')[0] });
      setShowExpenseModal(false);
      toast.success('Expense added 💸');
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const addIncome = async (incomeData) => {
    try {
      // Update budget with new income
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      // Add to budget total
      const newTotal = budget.total_income + incomeData.amount;
      await axios.put(`${API}/budget/${currentMonth}/${currentYear}`, {
        ...budget,
        total_income: newTotal
      });
      
      setBudget({ ...budget, total_income: newTotal });
      setShowIncomeModal(false);
      toast.success(`+€${incomeData.amount} income added! 💰`);
      
      // Reload budget
      await loadData();
    } catch (error) {
      toast.error('Failed to add income');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API}/expenses/${id}`);
      setExpenses(expenses.filter(e => e.id !== id));
      toast.success('Expense deleted');
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!budget) {
    return null;
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const moneyLeft = budget.total_income - totalSpent;
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const today = new Date().getDate();
  const daysLeft = daysInMonth - today;
  const daysPassed = today;
  const burnRate = daysPassed > 0 ? totalSpent / daysPassed : 0;
  const safeDailySpend = daysLeft > 0 ? moneyLeft / daysLeft : 0;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-1" data-testid="app-title">SmartSaveAI</h1>
            <p className="text-sm text-muted-foreground font-medium">Financial Intelligence Platform</p>
          </div>
          <Button
            onClick={() => setShowIncomeModal(true)}
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 shadow-lg shadow-purple-500/25 font-semibold text-sm"
            data-testid="add-income-btn"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Income
          </Button>
        </div>
      </div>

      {/* Money Left Hero */}
      <div className="mb-8 premium-gradient rounded-3xl p-8 animate-slide-up" data-testid="money-left-card">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-5 h-5 opacity-90" />
          <span className="text-sm font-semibold opacity-90 uppercase tracking-wider">Available Balance</span>
        </div>
        <div className="text-7xl font-bold tracking-tighter mb-2 number-display" data-testid="money-left-amount">
          €{moneyLeft.toFixed(2)}
        </div>
        <div className="text-sm opacity-80 font-medium">
          {((moneyLeft / budget.total_income) * 100).toFixed(1)}% of €{budget.total_income.toFixed(2)} budget
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in">
        <div className="premium-card p-6 stat-card" data-testid="days-left-card">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Days Left</span>
          </div>
          <div className="text-4xl font-bold number-display" data-testid="days-left-value">{daysLeft}</div>
          <div className="text-xs text-muted-foreground mt-1">in month</div>
        </div>

        <div className="premium-card p-6 stat-card" data-testid="burn-rate-card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Burn Rate</span>
          </div>
          <div className="text-4xl font-bold number-display" data-testid="burn-rate-value">€{burnRate.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground mt-1">per day</div>
        </div>

        <div className="premium-card p-6 stat-card" data-testid="safe-daily-spend-card">
          <div className="flex items-center gap-2 mb-3">
            <Zap className={`w-4 h-4 ${safeDailySpend < 0 ? 'text-red-400' : 'text-green-400'}`} />
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Daily Budget</span>
          </div>
          <div className={`text-4xl font-bold number-display ${safeDailySpend < 0 ? 'text-red-400' : 'text-green-400'}`} data-testid="safe-daily-spend-value">
            €{safeDailySpend.toFixed(2)}
          </div>
          {safeDailySpend < 0 && (
            <div className="text-xs text-red-400 mt-1 font-medium">Budget exceeded</div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in">
        <Button
          onClick={() => setShowAIModal(true)}
          className="h-14 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold"
          data-testid="ai-advice-btn"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Insights
        </Button>
        <Button
          onClick={() => setShowCategoryModal(true)}
          className="h-14 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold"
          data-testid="insights-btn"
        >
          <PieChart className="w-4 h-4 mr-2" />
          Analytics
        </Button>
        <Button
          onClick={() => setShowExpenseModal(true)}
          className="h-14 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 shadow-lg shadow-purple-500/25 font-semibold"
          data-testid="add-expense-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Expense
        </Button>
      </div>

      {/* Gamification Components */}
      <div className="space-y-5 mb-8 animate-fade-in">
        <StreakTracker 
          expenses={expenses} 
          budget={budget} 
          moneyLeft={moneyLeft}
          daysLeft={daysLeft}
        />
        <HealthScore 
          expenses={expenses} 
          budget={budget} 
          moneyLeft={moneyLeft}
        />
      </div>

      {/* Recent Expenses */}
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />

      {/* Add Expense Modal */}
      <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
        <DialogContent className="bg-black border border-white/10 max-w-lg p-0 gap-0" data-testid="expense-modal">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Add Expense</h2>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Amount Input */}
            <div className="mb-8">
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-bold text-white/30">€</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="bg-[#1a1a1a] border-white/10 h-28 text-6xl font-bold text-right pr-6 text-white placeholder:text-white/20"
                  data-testid="expense-amount-input"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="mb-8">
              <label className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 block">Category</label>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setNewExpense({ ...newExpense, category: cat.name })}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                      newExpense.category === cat.name
                        ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 ring-2 ring-purple-500'
                        : 'bg-[#1a1a1a] hover:bg-[#222222] border border-white/5'
                    }`}
                    data-testid={`category-${cat.name.toLowerCase()}`}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {cat.icon}
                    </div>
                    <span className="text-white font-semibold text-sm">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div className="mb-8">
              <label className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 block">Note (Optional)</label>
              <Input
                placeholder="What did you buy?"
                value={newExpense.note}
                onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })}
                className="bg-[#1a1a1a] border-white/10 h-14 text-white placeholder:text-white/30"
                data-testid="expense-note-input"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={addExpense}
              className="w-full h-16 text-lg font-bold rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/20"
              data-testid="submit-expense-btn"
            >
              Add Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Income Modal */}
      <AddIncomeModal
        open={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        onAddIncome={addIncome}
      />

      {/* AI Assistant Modal */}
      <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
        <DialogContent className="bg-card border-border max-w-lg" data-testid="ai-modal" aria-describedby="ai-dialog-description">
          <div id="ai-dialog-description" className="sr-only">Get AI-powered financial advice based on your spending</div>
          <AIAssistant
            moneyLeft={moneyLeft}
            daysLeft={daysLeft}
            burnRate={burnRate}
            safeDailySpend={safeDailySpend}
            expenses={expenses}
            totalIncome={budget.total_income}
            totalSpent={totalSpent}
          />
        </DialogContent>
      </Dialog>

      {/* Category Breakdown Modal */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="bg-card border-border" data-testid="category-modal" aria-describedby="category-dialog-description">
          <DialogHeader>
            <DialogTitle>Category Breakdown</DialogTitle>
          </DialogHeader>
          <div id="category-dialog-description" className="sr-only">View your spending breakdown by category</div>
          <CategoryBreakdown expenses={expenses} totalSpent={totalSpent} />
        </DialogContent>
      </Dialog>
    </div>
  );
}