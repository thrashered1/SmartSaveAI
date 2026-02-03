import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

const QUICK_AMOUNTS = [10, 20, 50, 100];

export default function AddMoneyModal({ open, onClose, goal, onAddMoney }) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('income');

  const progress = (goal.current_amount / goal.target_amount) * 100;

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    onAddMoney(goal.id, parseFloat(amount), source);
    setAmount('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1f3a] border-border max-w-md" data-testid="add-money-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">{goal.icon}</span>
            Add to {goal.name}
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">€{goal.current_amount.toFixed(2)}</span>
            <span className="text-muted-foreground">€{goal.target_amount.toFixed(2)}</span>
          </div>
          <Progress value={progress} className="h-2 bg-[#2a3150]" />
          <div className="text-center text-sm text-muted-foreground mt-1">{progress.toFixed(1)}%</div>
        </div>

        <div className="space-y-5 mt-4">
          {/* Amount Input */}
          <div>
            <Label className="text-xs text-[#9ca3af] uppercase mb-2 block">AMOUNT</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-[#9ca3af]">€</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#2a3150] border-transparent h-20 text-4xl font-bold text-center"
                data-testid="add-money-amount"
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <Label className="text-xs text-[#9ca3af] uppercase mb-2 block">QUICK ADD</Label>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map(quickAmount => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="bg-[#2a3150] hover:bg-primary/20 hover:border-primary border border-transparent rounded-xl py-3 font-bold transition-all"
                  data-testid={`quick-${quickAmount}`}
                >
                  +€{quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Source Selection */}
          <div>
            <Label className="text-xs text-[#9ca3af] uppercase mb-2 block">WHERE IS THIS MONEY FROM?</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSource('income')}
                className={`py-3 rounded-full font-medium transition-all ${
                  source === 'income'
                    ? 'bg-primary text-white'
                    : 'bg-[#2a3150] text-muted-foreground hover:bg-[#3a4160]'
                }`}
                data-testid="source-income"
              >
                New Income
              </button>
              <button
                onClick={() => setSource('transfer')}
                className={`py-3 rounded-full font-medium transition-all ${
                  source === 'transfer'
                    ? 'bg-primary text-white'
                    : 'bg-[#2a3150] text-muted-foreground hover:bg-[#3a4160]'
                }`}
                data-testid="source-transfer"
              >
                Transfer
              </button>
            </div>
            {source === 'transfer' && (
              <div className="mt-2 text-xs text-warning flex items-center gap-1">
                ⚠️ This will reduce your main budget
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full h-14 text-lg rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7c3aed] hover:opacity-90"
            data-testid="submit-add-money"
          >
            Add to Goal 🎯
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}