import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Calendar, TrendingUp, TrendingDown, Download, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import CategoryDonutChart from '../components/analytics/CategoryDonutChart';
import SpendingTrendsChart from '../components/analytics/SpendingTrendsChart';
import MonthlyComparison from '../components/analytics/MonthlyComparison';
import TopInsights from '../components/analytics/TopInsights';
import MerchantTracking from '../components/analytics/MerchantTracking';
import { generatePDFReport } from '../utils/pdfGenerator';
import { startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek, format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Insights() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [dateRange, setDateRange] = useState('this-month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const budgetRes = await axios.get(`${API}/budget/${currentMonth}/${currentYear}`);
      setBudget(budgetRes.data);
      
      const expensesRes = await axios.get(`${API}/expenses/${currentMonth}/${currentYear}`);
      setExpenses(expensesRes.data);
      
      // Load last month expenses for comparison
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      try {
        const lastMonthRes = await axios.get(`${API}/expenses/${lastMonth}/${lastYear}`);
        setExpenses(prev => [...prev, ...lastMonthRes.data]);
      } catch (e) {
        // Last month might not exist
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = useMemo(() => {
    if (!expenses.length) return [];
    
    let start, end;
    const now = new Date();
    
    switch (dateRange) {
      case 'this-week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'this-month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'last-month':
        start = startOfMonth(subMonths(now, 1));
        end = endOfMonth(subMonths(now, 1));
        break;
      case 'custom':
        if (!customStart || !customEnd) return expenses;
        start = new Date(customStart);
        end = new Date(customEnd);
        break;
      default:
        return expenses;
    }
    
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= start && expDate <= end;
    });
  }, [expenses, dateRange, customStart, customEnd]);

  const handleExportPDF = () => {
    generatePDFReport(filteredExpenses, budget, dateRange);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Loading insights...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="insights-title">Insights</h1>
        <p className="text-sm text-muted-foreground">Understand your spending patterns</p>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6 animate-fade-in">
        <Tabs value={dateRange} onValueChange={setDateRange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card border border-border/50">
            <TabsTrigger value="this-week" data-testid="filter-this-week">This Week</TabsTrigger>
            <TabsTrigger value="this-month" data-testid="filter-this-month">This Month</TabsTrigger>
            <TabsTrigger value="last-month" data-testid="filter-last-month">Last Month</TabsTrigger>
            <TabsTrigger value="custom" data-testid="filter-custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-card border border-border/50 rounded-xl px-3 py-2 text-sm"
              data-testid="custom-start-date"
            />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-card border border-border/50 rounded-xl px-3 py-2 text-sm"
              data-testid="custom-end-date"
            />
          </div>
        )}
      </div>

      {/* Export Button */}
      <Button
        onClick={handleExportPDF}
        variant="secondary"
        className="w-full mb-6 h-12 rounded-full"
        data-testid="export-pdf-btn"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Report (PDF)
      </Button>

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground" data-testid="no-data-message">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No expenses in this period</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Insights */}
          <TopInsights expenses={filteredExpenses} />

          {/* Category Breakdown */}
          <CategoryDonutChart expenses={filteredExpenses} />

          {/* Spending Trends */}
          <SpendingTrendsChart expenses={filteredExpenses} />

          {/* Monthly Comparison */}
          {dateRange === 'this-month' && (
            <MonthlyComparison currentExpenses={filteredExpenses} allExpenses={expenses} />
          )}

          {/* Merchant Tracking */}
          <MerchantTracking expenses={filteredExpenses} />
        </div>
      )}
    </div>
  );
}