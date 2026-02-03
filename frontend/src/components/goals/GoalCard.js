import { Trash2, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { format, differenceInDays } from 'date-fns';

export default function GoalCard({ goal, onAddMoney, onDelete, completed = false }) {
  const progress = (goal.current_amount / goal.target_amount) * 100;
  const remaining = goal.target_amount - goal.current_amount;
  
  const daysLeft = goal.deadline ? differenceInDays(new Date(goal.deadline), new Date()) : null;
  const dailyTarget = daysLeft && daysLeft > 0 ? remaining / daysLeft : 0;

  const priorityColors = {
    low: 'border-[#6b7280]',
    medium: 'border-[#FFB800]',
    high: 'border-[#FF3B5C]'
  };

  const progressColor = progress < 50 ? 'bg-gradient-to-r from-[#FF3B5C] to-[#FFB800]'
    : progress < 80 ? 'bg-gradient-to-r from-[#FFB800] to-[#00F5A0]'
    : 'bg-gradient-to-r from-[#00F5A0] to-[#00D4FF]';

  return (
    <div className={`bg-card border-2 ${
      priorityColors[goal.priority]
    } rounded-3xl p-5 transition-all hover:shadow-lg ${
      completed ? 'opacity-60' : ''
    }`} data-testid={`goal-card-${goal.id}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{goal.icon}</div>
          <div>
            <h3 className="font-bold text-lg">{goal.name}</h3>
            <div className="text-xs text-muted-foreground capitalize">{goal.priority} priority</div>
          </div>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-muted-foreground hover:text-destructive transition-colors"
          data-testid="delete-goal-btn"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">€{goal.current_amount.toFixed(2)}</span>
          <span className="text-muted-foreground">€{goal.target_amount.toFixed(2)}</span>
        </div>
        <div className="relative">
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-500`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
        <div className="text-center text-sm font-bold text-primary mt-1">{progress.toFixed(1)}%</div>
      </div>

      {/* Deadline & Daily Target */}
      {goal.deadline && !completed && (
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days left` : 'Overdue'}
          </div>
          {dailyTarget > 0 && (
            <div className="flex items-center gap-1 text-success">
              <TrendingUp className="w-3 h-3" />
              €{dailyTarget.toFixed(2)}/day
            </div>
          )}
        </div>
      )}

      {/* Add Money Button */}
      {!completed && (
        <Button
          onClick={onAddMoney}
          className="w-full h-10 rounded-full bg-primary hover:bg-primary/90"
          data-testid="add-money-btn"
        >
          Add Money
        </Button>
      )}

      {completed && (
        <div className="text-center text-sm text-success font-semibold">
          ✅ Completed {goal.completed_at && format(new Date(goal.completed_at), 'MMM dd, yyyy')}
        </div>
      )}
    </div>
  );
}