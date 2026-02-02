import { Utensils, Car, Home, PartyPopper, ShoppingBag, Package } from 'lucide-react';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Rent: Home,
  Fun: PartyPopper,
  Shopping: ShoppingBag,
  Other: Package
};

const CATEGORY_COLORS = {
  Food: '#793AFF',
  Transport: '#5E2AD6',
  Rent: '#34C759',
  Fun: '#FFCC00',
  Shopping: '#FF3B30',
  Other: '#A1A1AA'
};

export default function CategoryBreakdown({ expenses, totalSpent }) {
  const categoryTotals = {};
  expenses.forEach(exp => {
    if (!categoryTotals[exp.category]) {
      categoryTotals[exp.category] = 0;
    }
    categoryTotals[exp.category] += exp.amount;
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  if (sortedCategories.length === 0) {
    return <div className="text-center py-8 text-muted-foreground" data-testid="no-category-data">No expenses to analyze yet</div>;
  }

  return (
    <div className="space-y-4" data-testid="category-breakdown">
      {sortedCategories.map(([category, amount]) => {
        const Icon = CATEGORY_ICONS[category] || Package;
        const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
        const color = CATEGORY_COLORS[category];
        const isHighSpending = percentage > 40;

        return (
          <div key={category} className="space-y-2" data-testid={`category-${category.toLowerCase()}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="category-icon">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium" data-testid={`category-name-${category.toLowerCase()}`}>{category}</span>
                {isHighSpending && (
                  <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full">⚠️ High</span>
                )}
              </div>
              <div className="text-right">
                <div className="font-bold" data-testid={`category-amount-${category.toLowerCase()}`}>€{amount.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground" data-testid={`category-percentage-${category.toLowerCase()}`}>{percentage.toFixed(1)}%</div>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${percentage}%`, backgroundColor: color }}
                data-testid={`category-bar-${category.toLowerCase()}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}