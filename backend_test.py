import requests
import sys
import json
from datetime import datetime

class SmartSaveAITester:
    def __init__(self, base_url="https://studentfinance-3.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.budget_id = None
        self.expense_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)

            print(f"Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error Response: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"Error Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_create_budget(self):
        """Test budget creation"""
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        budget_data = {
            "month": str(current_month),
            "year": current_year,
            "income_sources": [
                {"name": "Salary", "amount": 2000.0},
                {"name": "Scholarship", "amount": 500.0}
            ]
        }
        
        success, response = self.run_test(
            "Create Budget",
            "POST",
            "budget",
            200,
            data=budget_data
        )
        
        if success and 'id' in response:
            self.budget_id = response['id']
            print(f"Budget ID: {self.budget_id}")
        
        return success

    def test_get_budget(self):
        """Test budget retrieval"""
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        return self.run_test(
            "Get Budget",
            "GET",
            f"budget/{current_month}/{current_year}",
            200
        )

    def test_create_expense(self):
        """Test expense creation"""
        expense_data = {
            "amount": 25.50,
            "category": "Food",
            "note": "Lunch at cafeteria",
            "date": datetime.now().strftime("%Y-%m-%d")
        }
        
        success, response = self.run_test(
            "Create Expense",
            "POST",
            "expenses",
            200,
            data=expense_data
        )
        
        if success and 'id' in response:
            self.expense_ids.append(response['id'])
            print(f"Expense ID: {response['id']}")
        
        return success

    def test_get_expenses(self):
        """Test expense retrieval"""
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        return self.run_test(
            "Get Expenses",
            "GET",
            f"expenses/{current_month}/{current_year}",
            200
        )

    def test_ai_advice(self):
        """Test AI advice generation"""
        ai_request = {
            "money_left": 1500.0,
            "days_left": 15,
            "burn_rate": 50.0,
            "safe_daily_spend": 100.0,
            "expenses": [
                {"amount": 25.50, "category": "Food"},
                {"amount": 15.00, "category": "Transport"}
            ],
            "total_income": 2500.0,
            "total_spent": 1000.0
        }
        
        return self.run_test(
            "AI Advice Generation",
            "POST",
            "ai-advice",
            200,
            data=ai_request
        )

    def test_delete_expense(self):
        """Test expense deletion"""
        if not self.expense_ids:
            print("⚠️ No expense IDs available for deletion test")
            return False
        
        expense_id = self.expense_ids[0]
        success, _ = self.run_test(
            "Delete Expense",
            "DELETE",
            f"expenses/{expense_id}",
            200
        )
        
        if success:
            self.expense_ids.remove(expense_id)
        
        return success

def main():
    print("🚀 Starting SmartSaveAI Backend API Tests")
    print("=" * 50)
    
    tester = SmartSaveAITester()
    
    # Test sequence
    tests = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("Create Budget", tester.test_create_budget),
        ("Get Budget", tester.test_get_budget),
        ("Create Expense", tester.test_create_expense),
        ("Get Expenses", tester.test_get_expenses),
        ("AI Advice", tester.test_ai_advice),
        ("Delete Expense", tester.test_delete_expense),
    ]
    
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())