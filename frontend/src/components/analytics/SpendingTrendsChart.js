import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, eachDayOfInterval, startOfDay, isWeekend } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SpendingTrendsChart({ expenses }) {
  const chartData = useMemo(() => {
    if (!expenses.length) return null;

    // Get date range
    const dates = expenses.map(e => new Date(e.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // Create daily totals
    const dailyTotals = {};
    expenses.forEach(exp => {
      const dateKey = format(new Date(exp.date), 'yyyy-MM-dd');
      dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + exp.amount;
    });

    // Fill in all days in range
    const allDays = eachDayOfInterval({ start: minDate, end: maxDate });
    const labels = allDays.map(d => format(d, 'MMM dd'));
    const data = allDays.map(d => {
      const key = format(d, 'yyyy-MM-dd');
      return dailyTotals[key] || 0;
    });

    // Calculate moving average (7-day)
    const movingAverage = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - 6);
      const slice = data.slice(start, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
      movingAverage.push(avg);
    }

    // Calculate weekend spending vs weekday
    let weekendTotal = 0, weekendCount = 0;
    let weekdayTotal = 0, weekdayCount = 0;
    allDays.forEach((day, i) => {
      if (isWeekend(day)) {
        weekendTotal += data[i];
        if (data[i] > 0) weekendCount++;
      } else {
        weekdayTotal += data[i];
        if (data[i] > 0) weekdayCount++;
      }
    });

    const weekendAvg = weekendCount > 0 ? weekendTotal / weekendCount : 0;
    const weekdayAvg = weekdayCount > 0 ? weekdayTotal / weekdayCount : 0;
    const weekendDiff = weekdayAvg > 0 ? ((weekendAvg - weekdayAvg) / weekdayAvg * 100).toFixed(0) : 0;

    return {
      labels,
      datasets: [
        {
          label: 'Daily Spending',
          data: data,
          borderColor: '#7B61FF',
          backgroundColor: 'rgba(123, 97, 255, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#7B61FF',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
        },
        {
          label: '7-Day Average',
          data: movingAverage,
          borderColor: '#00D4FF',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
      weekendDiff,
    };
  }, [expenses]);

  if (!chartData) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#A5B4FC',
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleColor: '#FFFFFF',
        bodyColor: '#A5B4FC',
        borderColor: '#793AFF',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            return `€${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#A5B4FC',
          callback: function(value) {
            return '€' + value;
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        border: {
          display: false,
        }
      },
      x: {
        ticks: {
          color: '#A5B4FC',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        }
      },
    },
  };

  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 animate-fade-in" data-testid="spending-trends-chart">
      <h2 className="text-lg font-semibold mb-4">Spending Trends</h2>
      
      <div className="mb-4">
        <Line data={chartData} options={options} />
      </div>

      {chartData.weekendDiff > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-2xl p-3 text-sm" data-testid="weekend-insight">
          ⚠️ You spend {Math.abs(chartData.weekendDiff)}% more on weekends
        </div>
      )}
    </div>
  );
}