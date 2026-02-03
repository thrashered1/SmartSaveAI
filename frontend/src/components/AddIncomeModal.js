import { useState } from 'react';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { X } from 'lucide-react';

const INCOME_SOURCES = [
  { name: 'Salary', icon: '💼', color: 'bg-[#4A90E2]' },
  { name: 'Scholarship', icon: '🎓', color: 'bg-[#7B61FF]' },
  { name: 'Freelance', icon: '💻', color: 'bg-[#00D4FF]' },
  { name: 'Parents', icon: '🎁', color: 'bg-[#FF6B9D]' },
  { name: 'Side Hustle', icon: '💰', color: 'bg-[#FFB800]' },
  { name: 'Other', icon: '✨', color: 'bg-[#A5B4FC]' },
];

export default function AddIncomeModal({ open, onClose, onAddIncome }) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('Salary');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    onAddIncome({
      amount: parseFloat(amount),
      source,
      note,
      frequency: 'one-time'
    });
    
    setAmount('');
    setNote('');
    setSource('Salary');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1f3a] border-none max-w-md p-0 gap-0" data-testid="add-income-modal">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Add Income</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#2a3150] border-transparent h-24 text-5xl font-bold text-center text-gray-300 placeholder:text-gray-500"
              data-testid="income-amount-input"
            />
          </div>

          {/* Source Selection */}
          <div className="mb-6">
            <label className="text-[#9370DB] text-xs font-semibold uppercase mb-3 block">SOURCE</label>
            <div className="grid grid-cols-2 gap-3">
              {INCOME_SOURCES.map((src) => (
                <button
                  key={src.name}
                  onClick={() => setSource(src.name)}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                    source === src.name
                      ? 'bg-[#2a3150] ring-2 ring-primary'
                      : 'bg-[#2a3150] hover:bg-[#3a4160]'
                  }`}
                  data-testid={`source-${src.name.toLowerCase()}`}
                >
                  <div className={`w-12 h-12 rounded-xl ${src.color} flex items-center justify-center text-2xl`}>
                    {src.icon}
                  </div>
                  <span className="text-white font-medium">{src.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div className="mb-6">
            <label className="text-[#9370DB] text-xs font-semibold uppercase mb-3 block">NOTE (OPTIONAL)</label>
            <Input
              placeholder="Where did this come from?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-[#2a3150] border-transparent h-12 text-gray-300 placeholder:text-gray-500"
              data-testid="income-note-input"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full h-14 text-lg font-bold rounded-full bg-gradient-to-r from-[#00D4FF] to-[#FF1CF7] hover:opacity-90 disabled:opacity-50"
            data-testid="submit-income-btn"
          >
            I EARNED THIS 💰
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}