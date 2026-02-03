import { useEffect } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import confetti from 'canvas-confetti';
import { format } from 'date-fns';

export default function GoalCompletionModal({ open, onClose, goal }) {
  useEffect(() => {
    if (open) {
      // Confetti explosion
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#7c3aed', '#00D4FF', '#00F5A0', '#FFB800'];

      (function frame() {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [open]);

  if (!goal) return null;

  const daysToComplete = goal.created_at && goal.completed_at
    ? Math.ceil((new Date(goal.completed_at) - new Date(goal.created_at)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1f3a] border-border max-w-md text-center" data-testid="completion-modal">
        <div className="py-6">
          {/* Title */}
          <div className="text-5xl font-black mb-4 bg-gradient-to-r from-[#00D4FF] to-[#7c3aed] bg-clip-text text-transparent">
            🎉 GOAL COMPLETED!
          </div>

          {/* Goal Icon */}
          <div className="text-8xl mb-4 animate-bounce">{goal.icon}</div>

          {/* Goal Name */}
          <h2 className="text-3xl font-bold mb-6">{goal.name}</h2>

          {/* Stats Card */}
          <div className="bg-[#2a3150] rounded-2xl p-6 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Saved</span>
              <span className="font-bold text-xl">€{goal.current_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Taken</span>
              <span className="font-bold">{daysToComplete} days</span>
            </div>
            {daysToComplete > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average per Day</span>
                <span className="font-bold">€{(goal.current_amount / daysToComplete).toFixed(2)}/day</span>
              </div>
            )}
          </div>

          {/* Achievement Badge */}
          <div className="bg-gradient-to-r from-[#7c3aed] to-[#00D4FF] rounded-2xl p-4 mb-6">
            <div className="text-2xl mb-1">🏆</div>
            <div className="font-bold">Goal Crusher Unlocked!</div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onClose}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7c3aed]"
              data-testid="done-btn"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}