import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS = {
  Food: '#FFCC00',
  Transport: '#00D4FF',
  Rent: '#7B61FF',
  Fun: '#FF3B5C',
  Shopping: '#00F5A0',
  Other: '#A5B4FC'
};

export default function CategoryDonutChart({ expenses }) {
  const categoryTotals = {};
  let totalSpent = 0;

  expenses.forEach(exp => {
    const cat = exp.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.amount;
    totalSpent += exp.amount;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);

  const biggestCategory = sortedCategories[0];
  const biggestPercentage = totalSpent > 0 ? (biggestCategory[1] / totalSpent * 100).toFixed(1) : 0;

  const chartData = {
    labels: sortedCategories.map(([cat]) => cat),
    datasets: [
      {
        data: sortedCategories.map(([_, amount]) => amount),
        backgroundColor: sortedCategories.map(([cat]) => CATEGORY_COLORS[cat] || '#A5B4FC'),
        borderColor: '#0A0A0A',
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleColor: '#FFFFFF',
        bodyColor: '#A5B4FC',
        borderColor: '#793AFF',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const percentage = ((context.parsed / totalSpent) * 100).toFixed(1);
            return `€${context.parsed.toFixed(2)} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '70%',
  };

  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 animate-fade-in" data-testid="category-donut-chart">
      <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
      
      <div className="mb-6">
        <Doughnut data={chartData} options={options} />
      </div>

      {/* Legend */}
      <div className="space-y-2 mb-4">
        {sortedCategories.map(([cat, amount]) => {
          const percentage = ((amount / totalSpent) * 100).toFixed(1);
          return (
            <div key={cat} className="flex items-center justify-between" data-testid={`legend-${cat.toLowerCase()}`}>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat] || '#A5B4FC' }}
                />
                <span className="text-sm">{cat}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">€{amount.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Biggest Category Highlight */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4" data-testid="biggest-category">
        <div className="text-sm text-muted-foreground mb-1">Your biggest expense</div>
        <div className="text-lg font-bold">
          {biggestCategory[0]} (€{biggestCategory[1].toFixed(2)}, {biggestPercentage}%)
        </div>
      </div>
    </div>
  );
}