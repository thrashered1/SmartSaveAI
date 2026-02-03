import { useMemo } from 'react';
import { TrendingUp, Calendar, Award, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function TopInsights({ expenses }) {
  const insights = useMemo(() => {
    if (!expenses.length) return null;

    // Biggest expense
    const biggest = expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0]);

    // Most frequent category
    const catCounts = {};
    expenses.forEach(e => {
      catCounts[e.category] = (catCounts[e.category] || 0) + 1;
    });
    const mostFrequent = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];

    // Average daily spend
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const uniqueDays = new Set(expenses.map(e => e.date)).size;
    const avgDaily = total / Math.max(uniqueDays, 1);

    // Day-of-week analysis
    const dayTotals = {};
    expenses.forEach(e => {
      const day = format(new Date(e.date), 'EEEE');
      dayTotals[day] = (dayTotals[day] || 0) + e.amount;
    });
    const sortedDays = Object.entries(dayTotals).sort((a, b) => b[1] - a[1]);
    const mostExpensiveDay = sortedDays[0];
    const cheapestDay = sortedDays[sortedDays.length - 1];

    return {
      biggest,
      mostFrequent,
      avgDaily,
      mostExpensiveDay,
      cheapestDay,
      total,
      count: expenses.length,
    };
  }, [expenses]);

  if (!insights) return null;

  return (
    <div className="space-y-3 animate-fade-in" data-testid="top-insights">
      <h2 className="text-lg font-semibold mb-4">Top Insights</h2>

      {/* Biggest Expense */}
      <div className="bg-gradient-to-br from-[#793AFF] to-[#5E2AD6] rounded-2xl p-4 glow-purple" data-testid="insight-biggest">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm opacity-80 mb-1">Biggest Expense</div>
            <div className="text-lg font-bold">€{insights.biggest.amount.toFixed(2)} - {insights.biggest.category}</div>
            <div className="text-xs opacity-70">{format(new Date(insights.biggest.date), 'MMM dd, yyyy')}</div>
          </div>
        </div>
      </div>

      {/* Grid of smaller insights */}
      <div className="grid grid-cols-2 gap-3">
        {/* Most Frequent */}
        <div className="bg-card border border-border/50 rounded-2xl p-4" data-testid="insight-frequent">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Most Frequent</span>
          </div>
          <div className="font-bold">{insights.mostFrequent[0]}</div>
          <div className="text-xs text-muted-foreground">{insights.mostFrequent[1]} transactions</div>
        </div>

        {/* Average Daily */}
        <div className="bg-card border border-border/50 rounded-2xl p-4" data-testid="insight-avg-daily">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Avg Daily</span>
          </div>
          <div className="font-bold">€{insights.avgDaily.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">per day</div>
        </div>

        {/* Most Expensive Day */}
        <div className="bg-card border border-border/50 rounded-2xl p-4" data-testid="insight-expensive-day">
          <div className="text-xs text-muted-foreground mb-1">Most Expensive Day</div>
          <div className="font-bold">{insights.mostExpensiveDay[0]}</div>
          <div className="text-xs text-destructive">€{insights.mostExpensiveDay[1].toFixed(2)}</div>
        </div>

        {/* Cheapest Day */}
        <div className="bg-card border border-border/50 rounded-2xl p-4" data-testid="insight-cheapest-day">
          <div className="text-xs text-muted-foreground mb-1">Cheapest Day</div>
          <div className="font-bold">{insights.cheapestDay[0]}</div>
          <div className="text-xs text-success">€{insights.cheapestDay[1].toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}