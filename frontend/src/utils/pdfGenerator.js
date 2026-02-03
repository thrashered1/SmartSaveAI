import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const generatePDFReport = (expenses, budget, dateRange) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(124, 58, 237);
  doc.text('SmartSaveAI Report', 20, 20);
  
  // Period
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Period: ${dateRange.replace('-', ' ').toUpperCase()}`, 20, 30);
  doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 20, 37);
  
  // Summary
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgDaily = total / Math.max(new Set(expenses.map(e => e.date)).size, 1);
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Summary', 20, 50);
  
  doc.setFontSize(11);
  doc.text(`Total Expenses: €${total.toFixed(2)}`, 20, 60);
  doc.text(`Number of Transactions: ${expenses.length}`, 20, 67);
  doc.text(`Average Daily Spending: €${avgDaily.toFixed(2)}`, 20, 74);
  
  if (budget) {
    doc.text(`Monthly Budget: €${budget.total_income.toFixed(2)}`, 20, 81);
    doc.text(`Money Left: €${(budget.total_income - total).toFixed(2)}`, 20, 88);
  }
  
  // Category Breakdown
  doc.setFontSize(14);
  doc.text('Category Breakdown', 20, 105);
  
  const categoryTotals = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  
  const categoryData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amount]) => [
      cat,
      `€${amount.toFixed(2)}`,
      `${((amount / total) * 100).toFixed(1)}%`
    ]);
  
  doc.autoTable({
    startY: 110,
    head: [['Category', 'Amount', 'Percentage']],
    body: categoryData,
    theme: 'striped',
    headStyles: { fillColor: [124, 58, 237] },
  });
  
  // Transactions List
  const finalY = doc.lastAutoTable.finalY || 110;
  doc.setFontSize(14);
  doc.text('Recent Transactions', 20, finalY + 15);
  
  const transactionData = expenses
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20)
    .map(e => [
      format(new Date(e.date), 'MMM dd'),
      e.category,
      e.note || '-',
      `€${e.amount.toFixed(2)}`
    ]);
  
  doc.autoTable({
    startY: finalY + 20,
    head: [['Date', 'Category', 'Note', 'Amount']],
    body: transactionData,
    theme: 'striped',
    headStyles: { fillColor: [124, 58, 237] },
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save
  doc.save(`SmartSaveAI-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};