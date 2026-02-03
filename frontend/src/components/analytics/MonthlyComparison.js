import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export default function MonthlyComparison({ currentExpenses, allExpenses }) {
  const comparison = useMemo(() => {
    if (!allExpenses || allExpenses.length === 0) return null;

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Filter expenses
    const thisMonth = allExpenses.filter(e => {
      const date = new Date(e.date);
      return date >= thisMonthStart && date <= thisMonthEnd;
    });

    const lastMonth = allExpenses.filter(e => {
      const date = new Date(e.date);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });

    // Calculate totals
    const thisTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);
    const lastTotal = lastMonth.reduce((sum, e) => sum + e.amount, 0);
    const difference = thisTotal - lastTotal;
    const percentChange = lastTotal > 0 ? ((difference / lastTotal) * 100).toFixed(1) : 0;

    // Category comparison
    const thisCats = {};
    const lastCats = {};

    thisMonth.forEach(e => {
      thisCats[e.category] = (thisCats[e.category] || 0) + e.amount;
    });

    lastMonth.forEach(e => {
      lastCats[e.category] = (lastCats[e.category] || 0) + e.amount;
    });

    const categories = [...new Set([...Object.keys(thisCats), ...Object.keys(lastCats)])];
    const categoryComparisons = categories.map(cat => {
      const thisAmount = thisCats[cat] || 0;
      const lastAmount = lastCats[cat] || 0;
      const diff = thisAmount - lastAmount;
      const percent = lastAmount > 0 ? ((diff / lastAmount) * 100).toFixed(1) : 0;
      return { category: cat, thisAmount, lastAmount, diff, percent };
    }).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

    return {
      thisTotal,
      lastTotal,
      difference,
      percentChange,
      categoryComparisons,
      thisMonthName: format(thisMonthStart, 'MMMM'),
      lastMonthName: format(lastMonthStart, 'MMMM'),
    };
  }, [currentExpenses, allExpenses]);

  const isIncrease = comparison.difference > 0;

  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 animate-fade-in" data-testid="monthly-comparison">
      <h2 className="text-lg font-semibold mb-4">Monthly Comparison</h2>

      {/* Total Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <div className="text-xs text-muted-foreground mb-1">{comparison.thisMonthName}</div>
          <div className="text-2xl font-bold" data-testid="this-month-total">€{comparison.thisTotal.toFixed(2)}</div>
        </div>
        <div className="bg-secondary/50 rounded-2xl p-4">
          <div className="text-xs text-muted-foreground mb-1">{comparison.lastMonthName}</div>
          <div className="text-2xl font-bold" data-testid="last-month-total">€{comparison.lastTotal.toFixed(2)}</div>
        </div>
      </div>

      {/* Difference */}
      <div className={`flex items-center justify-center gap-2 mb-6 p-4 rounded-2xl ${
        isIncrease ? 'bg-destructive/10 border border-destructive/20' : 'bg-success/10 border border-success/20'
      }`} data-testid="comparison-summary">
        {isIncrease ? (
          <TrendingUp className="w-5 h-5 text-destructive" />
        ) : (
          <TrendingDown className="w-5 h-5 text-success" />
        )}
        <span className={isIncrease ? 'text-destructive font-semibold' : 'text-success font-semibold'}>
          {isIncrease ? '+' : ''}€{comparison.difference.toFixed(2)} ({isIncrease ? '+' : ''}{comparison.percentChange}%)
        </span>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-3">
        <div className="text-sm font-semibold mb-2">By Category</div>
        {comparison.categoryComparisons.map(cat => {
          const isUp = cat.diff > 0;
          return (
            <div key={cat.category} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl" data-testid={`category-comparison-${cat.category.toLowerCase()}`}>
              <span className="text-sm">{cat.category}</span>
              <div className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground">
                  €{cat.thisAmount.toFixed(0)} vs €{cat.lastAmount.toFixed(0)}
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  isUp ? 'text-destructive' : 'text-success'
                }`}>
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(cat.percent)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}