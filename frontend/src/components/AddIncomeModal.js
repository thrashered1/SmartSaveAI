import { useState } from 'react';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { X } from 'lucide-react';

const INCOME_SOURCES = [
  { name: 'Salary', icon: '💼', color: 'from-purple-500 to-purple-600' },
  { name: 'Scholarship', icon: '🎓', color: 'from-purple-400 to-purple-500' },
  { name: 'Freelance', icon: '💻', color: 'from-purple-600 to-purple-700' },
  { name: 'Parents', icon: '🎁', color: 'from-purple-500 to-indigo-500' },
  { name: 'Side Hustle', icon: '💰', color: 'from-indigo-500 to-purple-600' },
  { name: 'Other', icon: '✨', color: 'from-purple-400 to-indigo-400' },
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
      <DialogContent className="bg-black border border-white/10 max-w-lg p-0 gap-0" data-testid="add-income-modal">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Add Income</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-8">
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-bold text-white/30">€</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#1a1a1a] border-white/10 h-28 text-6xl font-bold text-right pr-6 text-white placeholder:text-white/20"
                data-testid="income-amount-input"
              />
            </div>
          </div>

          {/* Source Selection */}
          <div className="mb-8">
            <label className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 block">Income Source</label>
            <div className="grid grid-cols-2 gap-3">
              {INCOME_SOURCES.map((src) => (
                <button
                  key={src.name}
                  onClick={() => setSource(src.name)}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                    source === src.name
                      ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 ring-2 ring-purple-500'
                      : 'bg-[#1a1a1a] hover:bg-[#222222] border border-white/5'
                  }`}
                  data-testid={`source-${src.name.toLowerCase()}`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${src.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {src.icon}
                  </div>
                  <span className="text-white font-semibold text-sm">{src.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div className="mb-8">
            <label className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 block">Note (Optional)</label>
            <Input
              placeholder="Where did this come from?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-[#1a1a1a] border-white/10 h-14 text-white placeholder:text-white/30"
              data-testid="income-note-input"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full h-16 text-lg font-bold rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 shadow-lg shadow-purple-500/20"
            data-testid="submit-income-btn"
          >
            Add Income
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}