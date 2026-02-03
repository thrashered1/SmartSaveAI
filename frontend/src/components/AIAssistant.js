import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Loader2 } from 'lucide-react';
import { DialogHeader, DialogTitle } from './ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AIAssistant({ moneyLeft, daysLeft, burnRate, safeDailySpend, expenses, totalIncome, totalSpent }) {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${API}/ai-advice`, {
          money_left: moneyLeft,
          days_left: daysLeft,
          burn_rate: burnRate,
          safe_daily_spend: safeDailySpend,
          expenses: expenses,
          total_income: totalIncome,
          total_spent: totalSpent
        });
        setAdvice(res.data.advice);
      } catch (error) {
        setAdvice("Can't connect to AI right now. Keep it tight, you got this! 💪");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [moneyLeft, daysLeft, burnRate, safeDailySpend, expenses, totalIncome, totalSpent]);

  return (
    <div data-testid="ai-assistant">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#793AFF] to-[#5E2AD6] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          SmartSave Bot
        </DialogTitle>
      </DialogHeader>
      
      <div className="mt-6 space-y-4">
        {/* Stats Summary */}
        <div className="bg-secondary/50 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Money Left</span>
            <span className="font-bold">€{moneyLeft.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Days Left</span>
            <span className="font-bold">{daysLeft}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Safe Daily Spend</span>
            <span className={`font-bold ${safeDailySpend < 0 ? 'text-destructive' : 'text-success'}`}>
              €{safeDailySpend.toFixed(2)}
            </span>
          </div>
        </div>

        {/* AI Advice */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5" data-testid="ai-advice-box">
          {loading ? (
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Thinking...</span>
            </div>
          ) : (
            <p className="text-base leading-relaxed" data-testid="ai-advice-text">{advice}</p>
          )}
        </div>
      </div>
    </div>
  );
}