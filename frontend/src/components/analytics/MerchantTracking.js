import { useMemo } from 'react';
import { Store } from 'lucide-react';

export default function MerchantTracking({ expenses }) {
  const merchants = useMemo(() => {
    const merchantData = {};
    
    expenses.forEach(exp => {
      // Extract merchant from note or use category
      const merchant = exp.note || exp.category;
      if (!merchantData[merchant]) {
        merchantData[merchant] = { total: 0, count: 0 };
      }
      merchantData[merchant].total += exp.amount;
      merchantData[merchant].count += 1;
    });

    return Object.entries(merchantData)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [expenses]);

  if (!merchants.length) return null;

  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 animate-fade-in" data-testid="merchant-tracking">
      <h2 className="text-lg font-semibold mb-4">Top Merchants</h2>
      
      <div className="space-y-3">
        {merchants.map((merchant, index) => (
          <div key={merchant.name} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl" data-testid={`merchant-${index}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Store className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">{merchant.name}</div>
                <div className="text-xs text-muted-foreground">{merchant.count} visits</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">€{merchant.total.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">€{(merchant.total / merchant.count).toFixed(2)}/visit</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}