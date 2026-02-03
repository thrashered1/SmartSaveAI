import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MonthlyComparison({ currentExpenses, allExpenses }) {
  if (!allExpenses || allExpenses.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-3xl p-6 animate-fade-in text-center text-muted-foreground" data-testid="monthly-comparison">
        <p>Add more expenses to see monthly comparison</p>
      </div>
    );
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Filter expenses by month
  const thisMonthExpenses = allExpenses.filter(e => {
    const date = new Date(e.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const lastMonthExpenses = allExpenses.filter(e => {
    const date = new Date(e.date);
    return date.getMonth() === lastMonth && date.getFullYear() === lastYear;
  });

  // Calculate totals
  const thisTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const difference = thisTotal - lastTotal;
  const percentChange = lastTotal > 0 ? ((difference / lastTotal) * 100).toFixed(1) : 0;
  const isIncrease = difference > 0;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 animate-fade-in" data-testid="monthly-comparison">
      <h2 className="text-lg font-semibold mb-4">Monthly Comparison</h2>

      {/* Total Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <div className="text-xs text-muted-foreground mb-1">{monthNames[currentMonth]}</div>
          <div className="text-2xl font-bold" data-testid="this-month-total">€{thisTotal.toFixed(2)}</div>
        </div>
        <div className="bg-secondary/50 rounded-2xl p-4">
          <div className="text-xs text-muted-foreground mb-1">{monthNames[lastMonth]}</div>
          <div className="text-2xl font-bold" data-testid="last-month-total">€{lastTotal.toFixed(2)}</div>
        </div>
      </div>

      {/* Difference */}
      <div className={`flex items-center justify-center gap-2 p-4 rounded-2xl ${
        isIncrease ? 'bg-destructive/10 border border-destructive/20' : 'bg-success/10 border border-success/20'
      }`} data-testid="comparison-summary">
        {isIncrease ? (
          <TrendingUp className="w-5 h-5 text-destructive" />
        ) : (
          <TrendingDown className="w-5 h-5 text-success" />
        )}
        <span className={isIncrease ? 'text-destructive font-semibold' : 'text-success font-semibold'}>
          {isIncrease ? '+' : ''}€{difference.toFixed(2)} ({isIncrease ? '+' : ''}{percentChange}%)
        </span>
      </div>
    </div>
  );
}
