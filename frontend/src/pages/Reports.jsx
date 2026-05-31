import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import { FiArrowUpRight, FiArrowDownLeft, FiBookOpen, FiDownload, FiFileText } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Reports({ transactions, categories, onAdviceHubClick }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reportType, setReportType] = useState('monthly');

  const formatCurrency = (val) => {
    const cur = 'INR';
    return new Intl.NumberFormat(cur === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: cur
    }).format(val);
  };

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  // Pie/Category distribution data mapping
  const categoryRankings = Object.entries(
    transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, curr) => {
        const catName = curr.category?.name || 'General';
        acc[catName] = (acc[catName] || 0) + curr.amount;
        return acc;
      }, {})
  ).map(([name, value]) => {
    const category = categories.find(c => c.name === name);
    return { name, value: parseFloat(value.toFixed(2)), color: category?.color || '#cbd5e0' };
  }).sort((a, b) => b.value - a.value);

  // Recharts: Monthly comparison data
  const barData = [
    { name: 'Mar 26', Income: 1800, Expense: 1200 },
    { name: 'Apr 26', Income: 2200, Expense: 1450 },
    { name: 'May 26', Income: totalIncome, Expense: totalExpense }
  ];

  const handleExportCSV = () => {
    // Simulated CSV export
    let csvContent = "data:text/csv;charset=utf-8,Date,Description,Category,Type,Amount\n";
    transactions.forEach(t => {
      csvContent += `${t.date},"${t.description}",${t.category?.name},${t.type},${t.amount}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `finscope_report_${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('success', 'CSV Report generated successfully.');
  };

  const handleDownloadPDF = () => {
    // Print window for quick PDF generation natively
    window.print();
    showToast('success', 'Preparing PDF report document for print...');
  };

  return (
    <div className="space-y-6 anim-slide print:m-0 print:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Financial Reports</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">Download and analyze your financial history.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="input-ui select-ui !py-2 !px-3 text-xs w-[120px]"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
          <Button onClick={handleExportCSV} variant="secondary" className="!py-2 !px-3 text-xs">
            <FiFileText />
            CSV
          </Button>
          <Button onClick={handleDownloadPDF} variant="primary" className="!py-2 !px-3 text-xs">
            <FiDownload />
            PDF
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Savings Rate Card */}
        <Card className="p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-glow)] rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <h4 className="font-bold text-md text-[var(--text-secondary)]">Cumulative Savings Rate</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">Percentage of income kept after expenses</p>
            <h3 className="text-3xl font-black tracking-tight text-[var(--primary)] mt-4">{savingsRate}%</h3>
          </div>

          <div 
            onClick={onAdviceHubClick}
            className="mt-6 p-3 bg-[rgba(99,102,241,0.06)] border border-[var(--border)] rounded-md text-xs leading-relaxed text-[var(--text-secondary)] cursor-pointer hover:bg-[rgba(99,102,241,0.12)] hover:border-[var(--primary)] transition-fast hover:scale-[1.01]"
            title="Click to open Aura AI Wealth Advisor"
          >
            <span className="font-bold text-[var(--primary)] flex items-center justify-between mb-0.5">
              <span>Advice Hub</span>
              <span className="text-[10px] bg-[rgba(99,102,241,0.2)] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider animate-pulse">View Advice</span>
            </span>
            To maintain high-quality portfolio growth, aim to secure a savings rate above **20%** consistently month-over-month. Click for personalized Indian tax & SIP advice.
          </div>
        </Card>

        {/* Cash Flow Bar Chart */}
        <Card className="lg:col-span-2 p-6 flex flex-col">
          <h4 className="font-bold text-md text-[var(--text-primary)]">Cash Flow Analytics</h4>
          <p className="text-xs text-[var(--text-muted)] mt-1">Monthly comparison of deposits vs spendings</p>
          
          <div className="h-72 w-full mt-4 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="Income" fill="var(--success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="var(--danger)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Rankings & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Rankings */}
        <Card className="p-6">
          <h4 className="font-bold text-md text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-3">Spendings Ranking</h4>
          <div className="space-y-4">
            {categoryRankings.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-5 text-center font-bold text-[var(--text-muted)]">{idx + 1}</span>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[var(--text-primary)] font-medium truncate">{item.name}</span>
                </div>
                <span className="font-bold text-[var(--text-primary)] shrink-0">{formatCurrency(item.value)}</span>
              </div>
            ))}
            {categoryRankings.length === 0 && (
              <div className="py-8 text-center text-[var(--text-muted)]">No spending distributions available</div>
            )}
          </div>
        </Card>

        {/* Insights Card */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-md text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-3">Monthly Insights</h4>
            <div className="space-y-3.5">
              {/* Top Income source */}
              <div className="p-3.5 bg-[rgba(16,185,129,0.03)] border border-[var(--success-glow)] rounded-lg flex gap-3 text-sm">
                <FiArrowUpRight size={18} className="text-[var(--success)] mt-0.5 shrink-0" />
                <div className="leading-relaxed text-[var(--text-secondary)]">
                  <strong className="text-[var(--success)] block mb-0.5">Leading Capital Addition</strong>
                  Your main income stream was <span className="font-bold text-[var(--text-primary)]">"Salary"</span>, bringing in a total value of <span className="font-bold text-[var(--text-primary)]">{formatCurrency(totalIncome)}</span>.
                </div>
              </div>

              {/* Highest Expense category */}
              <div className="p-3.5 bg-[rgba(244,63,94,0.03)] border border-[var(--danger-glow)] rounded-lg flex gap-3 text-sm">
                <FiArrowDownLeft size={18} className="text-[var(--danger)] mt-0.5 shrink-0" />
                <div className="leading-relaxed text-[var(--text-secondary)]">
                  <strong className="text-[var(--danger)] block mb-0.5">Top Expense Subtraction</strong>
                  {categoryRankings.length > 0 ? (
                    <span>Your highest spending area is <span className="font-bold text-[var(--text-primary)]">"{categoryRankings[0]?.name}"</span> with a cumulative total of <span className="font-bold text-[var(--text-primary)]">{formatCurrency(categoryRankings[0]?.value)}</span>.</span>
                  ) : (
                    <span>No expense items recorded for comparison yet.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
            <FiBookOpen size={14} />
            <span>Updates calculated in real-time</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
