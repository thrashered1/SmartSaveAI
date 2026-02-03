import { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { X } from 'lucide-react';
import { X } from 'lucide-react';

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
      <DialogContent className="bg-black border border-white/10 max-w-md p-0 gap-0" data-testid="create-goal-modal">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Create Goal</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Goal Name */}
          <div className="mb-6">
            <Label className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 block">Goal Name</Label>
            <Input
              placeholder="What are you saving for?"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#1a1a1a] border-white/10 h-14 text-white placeholder:text-white/30"
              maxLength={30}
              data-testid="goal-name-input"
            />
          </div>

          {/* Icon Selector */}
          <div className="mb-6">
            <Label className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 block">Choose Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {GOAL_ICONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                    formData.icon === icon 
                      ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 ring-2 ring-purple-500 scale-110' 
                      : 'bg-[#1a1a1a] hover:bg-[#222222] border border-white/5'
                  }`}
                  data-testid={`icon-${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Target Amount */}
          <div className="mb-6">
            <Label className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 block">Target Amount</Label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-bold text-white/30">€</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                className="bg-[#1a1a1a] border-white/10 h-28 text-6xl font-bold text-right pr-6 text-white placeholder:text-white/20"
                data-testid="target-amount-input"
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="mb-6">
            <Label className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 block">Deadline (Optional)</Label>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="bg-[#1a1a1a] border-white/10 h-14 text-white"
              data-testid="deadline-input"
            />
          </div>

          {/* Priority */}
          <div className="mb-8">
            <Label className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 block">Priority</Label>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map(priority => (
                <button
                  key={priority}
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`py-4 rounded-xl font-semibold capitalize transition-all ${
                    formData.priority === priority
                      ? priority === 'high' ? 'bg-red-500 text-white'
                        : priority === 'medium' ? 'bg-yellow-500 text-black'
                        : 'bg-gray-500 text-white'
                      : 'bg-[#1a1a1a] text-white/50 hover:bg-[#222222] border border-white/5'
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
            className="w-full h-16 text-lg font-bold rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 shadow-lg shadow-purple-500/20"
            data-testid="submit-goal-btn"
          >
            Create Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}