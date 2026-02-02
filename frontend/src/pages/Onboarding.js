import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plus, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const INCOME_TYPES = [
  { name: 'Salary / Allowance', key: 'salary' },
  { name: 'Scholarship', key: 'scholarship' },
  { name: 'Freelance / Side Hustle', key: 'freelance' },
  { name: 'Other Income', key: 'other' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [incomeSources, setIncomeSources] = useState([
    { name: 'Salary / Allowance', amount: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const addIncomeSource = () => {
    setIncomeSources([...incomeSources, { name: '', amount: '' }]);
  };

  const removeIncomeSource = (index) => {
    setIncomeSources(incomeSources.filter((_, i) => i !== index));
  };

  const updateIncomeSource = (index, field, value) => {
    const updated = [...incomeSources];
    updated[index][field] = value;
    setIncomeSources(updated);
  };

  const handleSubmit = async () => {
    const validSources = incomeSources.filter(s => s.name && s.amount && parseFloat(s.amount) > 0);
    
    if (validSources.length === 0) {
      toast.error('Add at least one income source');
      return;
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    setLoading(true);
    try {
      await axios.post(`${API}/budget`, {
        month: currentMonth.toString(),
        year: currentYear,
        income_sources: validSources.map(s => ({
          name: s.name,
          amount: parseFloat(s.amount)
        }))
      });
      
      toast.success('Budget created! 🎉');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = incomeSources.reduce((sum, s) => {
    const amount = parseFloat(s.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background p-6 flex flex-col justify-center">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#793AFF] to-[#5E2AD6] flex items-center justify-center glow-purple">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2" data-testid="onboarding-title">SmartSaveAI</h1>
          <p className="text-lg text-muted-foreground">What money do you have this month?</p>
        </div>

        {/* Income Sources */}
        <div className="space-y-4 mb-6">
          {incomeSources.map((source, index) => (
            <div key={index} className="bg-card border border-border/50 rounded-3xl p-5" data-testid={`income-source-${index}`}>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm text-muted-foreground">Income Source {index + 1}</Label>
                {incomeSources.length > 1 && (
                  <button
                    onClick={() => removeIncomeSource(index)}
                    className="text-destructive hover:text-destructive/80"
                    data-testid={`remove-income-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="e.g., Salary, Scholarship"
                  value={source.name}
                  onChange={(e) => updateIncomeSource(index, 'name', e.target.value)}
                  className="bg-secondary/50"
                  data-testid={`income-name-${index}`}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount (€)"
                  value={source.amount}
                  onChange={(e) => updateIncomeSource(index, 'amount', e.target.value)}
                  className="bg-secondary/50"
                  data-testid={`income-amount-${index}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add More Button */}
        <Button
          onClick={addIncomeSource}
          variant="secondary"
          className="w-full mb-6 h-12 rounded-full"
          data-testid="add-income-source-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Source
        </Button>

        {/* Total Display */}
        {totalIncome > 0 && (
          <div className="bg-gradient-to-br from-[#793AFF] to-[#5E2AD6] rounded-3xl p-6 mb-6 glow-purple" data-testid="total-income-display">
            <div className="text-sm opacity-80 mb-1">Total Monthly Budget</div>
            <div className="text-5xl font-black tracking-tighter" data-testid="total-income-amount">
              €{totalIncome.toFixed(2)}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={loading || totalIncome === 0}
          className="w-full h-14 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          data-testid="start-tracking-btn"
        >
          {loading ? 'Creating...' : 'Start Tracking 🚀'}
        </Button>
      </div>
    </div>
  );
}