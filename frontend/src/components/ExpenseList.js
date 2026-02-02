import { Trash2, ShoppingBag, Utensils, Car, Home, PartyPopper, Package } from 'lucide-react';
import { Button } from './ui/button';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Rent: Home,
  Fun: PartyPopper,
  Shopping: ShoppingBag,
  Other: Package
};

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground" data-testid="no-expenses-message">
        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No expenses yet. Add one to start tracking!</p>
      </div>
    );
  }

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-3" data-testid="expense-list">
      <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
      {sortedExpenses.map((expense) => {
        const Icon = CATEGORY_ICONS[expense.category] || Package;
        return (
          <div
            key={expense.id}
            className="bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between"
            data-testid={`expense-item-${expense.id}`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="category-icon">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium" data-testid={`expense-category-${expense.id}`}>{expense.category}</div>
                {expense.note && (
                  <div className="text-sm text-muted-foreground" data-testid={`expense-note-${expense.id}`}>{expense.note}</div>
                )}
                <div className="text-xs text-muted-foreground" data-testid={`expense-date-${expense.id}`}>{expense.date}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-destructive" data-testid={`expense-amount-${expense.id}`}>
                  -€{expense.amount.toFixed(2)}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(expense.id)}
              className="ml-2 hover:bg-destructive/10 hover:text-destructive"
              data-testid={`delete-expense-${expense.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}