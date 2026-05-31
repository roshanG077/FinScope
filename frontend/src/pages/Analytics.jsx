import React from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function Analytics({ transactions, categories }) {
  const { user } = useAuth();
  const formatCurrency = (val) => {
    const cur = 'INR';
    return new Intl.NumberFormat(cur === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency: cur }).format(val);
  };

  const expenses = transactions.filter(t => t.type === 'EXPENSE');
  const incomes = transactions.filter(t => t.type === 'INCOME');

  // Trend Data (Line Chart)
  const sortedDates = [...new Set(transactions.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })))].sort((a,b) => new Date(a) - new Date(b));
  
  const trendData = sortedDates.map(dateStr => {
    const dayEx = expenses.filter(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === dateStr).reduce((a,b) => a+b.amount, 0);
    const dayInc = incomes.filter(i => new Date(i.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === dateStr).reduce((a,b) => a+b.amount, 0);
    return { name: dateStr, Expense: dayEx, Income: dayInc };
  });

  // Top Categories (Bar Chart Horizontal)
  const categoryData = Object.entries(expenses.reduce((acc, curr) => {
    const catName = curr.category?.name || 'General';
    acc[catName] = (acc[catName] || 0) + curr.amount;
    return acc;
  }, {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className="space-y-6 anim-slide">
      <div>
        <h2 className="text-2xl font-black text-[var(--text-primary)]">Analytics & Insights</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">Deep dive into your financial data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 h-80 flex flex-col">
          <h4 className="font-bold text-md text-[var(--text-primary)] mb-4">Income vs Expense Trend</h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} width={60} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Line type="monotone" dataKey="Income" stroke="var(--success)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Expense" stroke="var(--danger)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 h-80 flex flex-col">
          <h4 className="font-bold text-md text-[var(--text-primary)] mb-4">Top Spending Categories</h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="value" fill="var(--danger)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
         <h4 className="font-bold text-md text-[var(--text-primary)] mb-4">Spending Heatmap Overview</h4>
         <div className="h-32 flex items-center justify-center text-[var(--text-muted)] text-sm border border-dashed border-[var(--border)] rounded bg-[rgba(255,255,255,0.01)]">
            Heatmap Visualization requires calendar layout (Placeholder for advanced custom D3/Recharts implementation)
         </div>
      </Card>
    </div>
  );
}
