import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const GOAL_ICONS = ['💻', '🏖️', '🎓', '🚗', '🏠', '💍', '🎮', '📱', '💰', '🎁', '✈️', '🏋️', '📚', '🎸', '🎨', '🍕', '🎬', '🐕'];

export default function CreateGoalModal({ open, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    icon: '💻',
    target_amount: '',
    deadline: '',
    priority: 'medium'
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.target_amount) return;
    
    onCreate({
      ...formData,
      target_amount: parseFloat(formData.target_amount),
      deadline: formData.deadline || null
    });
    
    setFormData({ name: '', icon: '💻', target_amount: '', deadline: '', priority: 'medium' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1f3a] border-border max-w-md" data-testid="create-goal-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Goal</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Goal Name */}
          <div>
            <Label className="text-xs text-[#9ca3af] uppercase mb-2 block">GOAL NAME</Label>
            <Input
              placeholder="What are you saving for?"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#2a3150] border-transparent h-12"
              maxLength={30}
              data-testid="goal-name-input"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <Label className="text-xs text-[#9ca3af] uppercase mb-2 block">CHOOSE ICON</Label>
            <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
              {GOAL_ICONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-12 h-12 rounded-xl bg-[#2a3150] flex items-center justify-center text-2xl transition-all ${
                    formData.icon === icon ? 'ring-2 ring-primary scale-110' : 'hover:bg-[#3a4160]'
                  }`}
                  data-testid={`icon-${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Target Amount */}
          <div>
            <Label className="text-xs text-[#9ca3af] uppercase mb-2 block">TARGET AMOUNT</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-[#9ca3af]">€</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                className="bg-[#2a3150] border-transparent h-20 text-4xl font-bold text-center"
                data-testid="target-amount-input"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <Label className="text-xs text-[#9ca3af] uppercase mb-2 block">DEADLINE (OPTIONAL)</Label>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="bg-[#2a3150] border-transparent h-12"
              data-testid="deadline-input"
            />
          </div>

          {/* Priority */}
          <div>
            <Label className="text-xs text-[#9ca3af] uppercase mb-2 block">PRIORITY</Label>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map(priority => (
                <button
                  key={priority}
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`py-3 rounded-full font-medium capitalize transition-all ${
                    formData.priority === priority
                      ? priority === 'high' ? 'bg-[#FF3B5C] text-white'
                        : priority === 'medium' ? 'bg-[#FFB800] text-white'
                        : 'bg-[#6b7280] text-white'
                      : 'bg-[#2a3150] text-muted-foreground hover:bg-[#3a4160]'
                  }`}
                  data-testid={`priority-${priority}`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.target_amount}
            className="w-full h-14 text-lg rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7c3aed] hover:opacity-90"
            data-testid="submit-goal-btn"
          >
            Create Goal 🎯
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}