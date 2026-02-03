import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ChevronDown, ChevronUp, Target, Wallet, TrendingUp, Shield } from 'lucide-react';

export default function HealthScore({ expenses, budget, moneyLeft }) {
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (budget && expenses.length > 0) {
      const calculateHealthScore = () => {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const daysPassed = new Date().getDate();

        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const dailyBudget = budget.total_income / daysInMonth;

        // 1. Budget Adherence (40 points)
        const expectedSpent = dailyBudget * daysPassed;
        const adherence = totalSpent > 0 ? Math.min((expectedSpent / totalSpent) * 40, 40) : 40;

        // 2. Savings Rate (30 points)
        const savingsRate = moneyLeft > 0 ? (moneyLeft / budget.total_income) * 30 : 0;

        // 3. Spending Consistency (20 points)
        const dailySpends = {};
        expenses.forEach(e => {
          dailySpends[e.date] = (dailySpends[e.date] || 0) + e.amount;
        });
        const spendValues = Object.values(dailySpends);
        const avgSpend = spendValues.reduce((a, b) => a + b, 0) / spendValues.length;
        const variance = spendValues.reduce((sum, val) => sum + Math.pow(val - avgSpend, 2), 0) / spendValues.length;
        const consistency = Math.max(20 - (variance / 100), 0);

        // 4. Emergency Fund (10 points)
        const monthsReserve = budget.total_income > 0 ? moneyLeft / budget.total_income : 0;
        const emergencyFund = Math.min(monthsReserve * 10, 10);

        const total = Math.round(adherence + savingsRate + consistency + emergencyFund);

        setScore(total);
        setBreakdown({
          budgetAdherence: Math.round(adherence),
          savingsRate: Math.round(savingsRate),
          consistency: Math.round(consistency),
          emergencyFund: Math.round(emergencyFund)
        });
      };

      calculateHealthScore();
    }
  }, [expenses, budget, moneyLeft]);

  const getScoreColor = () => {
    if (score >= 81) return '#00D4FF';
    if (score >= 61) return '#00F5A0';
    if (score >= 41) return '#FFB800';
    return '#FF3B5C';
  };

  const getScoreLabel = () => {
    if (score >= 81) return '✨ Excellent - Financial Ninja!';
    if (score >= 61) return '🟢 Good - Well Done!';
    if (score >= 41) return '🟡 Fair - Getting Better';
    return '🔴 Poor - Needs Attention';
  };

  if (!breakdown) return null;

  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 animate-fade-in" data-testid="health-score">
      <h2 className="text-lg font-semibold mb-4">Financial Health Score</h2>

      {/* Circular Progress */}
      <div className="flex flex-col items-center mb-6">
        <div style={{ width: 180, height: 180 }}>
          <CircularProgressbar
            value={score}
            text={`${score}`}
            styles={buildStyles({
              pathColor: getScoreColor(),
              textColor: '#FFFFFF',
              trailColor: '#2a3150',
              textSize: '24px',
            })}
          />
        </div>
        <div className="text-sm text-muted-foreground mt-2">/ 100</div>
        <div className="text-sm font-semibold mt-1">{getScoreLabel()}</div>
      </div>

      {/* Expand Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 text-primary text-sm font-medium hover:underline"
        data-testid="expand-breakdown"
      >
        {expanded ? 'Hide' : 'See'} Breakdown
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Breakdown */}
      {expanded && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {/* Budget Adherence */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span>Budget Adherence</span>
              </div>
              <span className="font-bold">{breakdown.budgetAdherence}/40</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(breakdown.budgetAdherence / 40) * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">You stay on track {Math.round((breakdown.budgetAdherence / 40) * 100)}% of the time</div>
          </div>

          {/* Savings Rate */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-success" />
                <span>Savings Rate</span>
              </div>
              <span className="font-bold">{breakdown.savingsRate}/30</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-success transition-all duration-500"
                style={{ width: `${(breakdown.savingsRate / 30) * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">You save {Math.round((breakdown.savingsRate / 30) * 100)}% of your income</div>
          </div>

          {/* Consistency */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00D4FF]" />
                <span>Spending Consistency</span>
              </div>
              <span className="font-bold">{breakdown.consistency}/20</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00D4FF] transition-all duration-500"
                style={{ width: `${(breakdown.consistency / 20) * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">Your spending is {breakdown.consistency >= 15 ? 'very' : 'fairly'} consistent</div>
          </div>

          {/* Emergency Fund */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-warning" />
                <span>Emergency Fund</span>
              </div>
              <span className="font-bold">{breakdown.emergencyFund}/10</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-warning transition-all duration-500"
                style={{ width: `${(breakdown.emergencyFund / 10) * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              You have {((breakdown.emergencyFund / 10) * 3).toFixed(1)} months of reserves
            </div>
          </div>
        </div>
      )}
    </div>
  );
}