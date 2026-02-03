import { useEffect, useState } from 'react';
import { Flame, Trophy } from 'lucide-react';

const MILESTONES = [
  { days: 7, name: 'Week Warrior', icon: '🏅' },
  { days: 14, name: 'Fortnight Legend', icon: '🔥' },
  { days: 30, name: 'Monthly Master', icon: '👑' },
  { days: 60, name: 'Budget Beast', icon: '💪' },
  { days: 90, name: 'Budget King', icon: '🏆' }
];

export default function StreakTracker({ expenses, budget, moneyLeft, daysLeft }) {
  const [streak, setStreak] = useState({ current: 0, best: 0 });

  useEffect(() => {
    // Load streak from localStorage
    const saved = localStorage.getItem('streak');
    if (saved) {
      setStreak(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Calculate and update streak
    if (budget && expenses.length > 0) {
      calculateStreak();
    }
  }, [expenses, budget, moneyLeft, daysLeft]);

  const calculateStreak = () => {
    const safeDailySpend = daysLeft > 0 ? moneyLeft / daysLeft : 0;
    
    // Get today's spending
    const today = new Date().toISOString().split('T')[0];
    const todayExpenses = expenses.filter(e => e.date === today);
    const todaySpent = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Check if under budget today
    const isUnderBudget = todaySpent <= safeDailySpend;
    
    // Update streak (simplified version - in production, check daily)
    const currentStreak = isUnderBudget ? streak.current + 1 : 0;
    const bestStreak = Math.max(currentStreak, streak.best);
    
    const newStreak = { current: currentStreak, best: bestStreak };
    setStreak(newStreak);
    localStorage.setItem('streak', JSON.stringify(newStreak));
  };

  const nextMilestone = MILESTONES.find(m => m.days > streak.current);
  const daysToMilestone = nextMilestone ? nextMilestone.days - streak.current : 0;
  const milestoneProgress = nextMilestone ? (streak.current / nextMilestone.days) * 100 : 100;

  const flameColor = streak.current >= 14 ? 'text-[#00D4FF]'
    : streak.current >= 7 ? 'text-[#FF3B5C]'
    : 'text-[#FFB800]';

  return (
    <div className="bg-card border-2 border-primary/30 rounded-3xl p-6 animate-fade-in" data-testid="streak-tracker">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 text-center">
          <div className={`text-6xl mb-2 ${streak.current > 0 ? 'animate-pulse' : ''} ${flameColor}`}>
            <Flame className="w-16 h-16 mx-auto" />
          </div>
          <div className="text-xs text-muted-foreground uppercase mb-1">Current Streak</div>
          <div className="text-5xl font-black tracking-tighter" data-testid="current-streak">
            {streak.current}
          </div>
          <div className="text-sm text-muted-foreground">days under budget!</div>
        </div>
      </div>

      <div className="h-px bg-border mb-4" />

      <div className="space-y-3">
        {/* Best Streak */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Best Streak</span>
          <span className="font-bold flex items-center gap-1">
            <Trophy className="w-4 h-4 text-warning" />
            {streak.best} days
          </span>
        </div>

        {/* Next Milestone */}
        {nextMilestone && (
          <div className="bg-secondary/50 rounded-2xl p-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Next Milestone</span>
              <span className="font-bold">{nextMilestone.icon} {nextMilestone.name}</span>
            </div>
            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-[#00D4FF] transition-all duration-500"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
            <div className="text-xs text-center text-muted-foreground mt-1">
              {daysToMilestone} more days to unlock
            </div>
          </div>
        )}
      </div>
    </div>
  );
}