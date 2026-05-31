import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Card from '../../components/ui/Card';
import { FiUsers, FiActivity, FiDollarSign, FiTrendingUp, FiTrendingDown, FiShield } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch admin analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics) return null;

  // Transforms the raw backend analytics into a format the charting library understands
  const chartData = [
    { name: 'Income', value: analytics.totalIncome || 0, color: '#10b981' },
    { name: 'Expense', value: analytics.totalExpense || 0, color: '#ef4444' }
  ];

  // Helper function to format numbers as Indian Rupees (INR)
  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(val || 0);

  // Helper component to keep the dashboard cards clean and easy to read
  const StatCard = ({ title, value, subtitle, icon, colorClass, bgColorClass, isCurrency = false }) => (
    <Card className="p-5 bg-[var(--bg-surface)] border-[var(--border)] shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColorClass} ${colorClass}`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-[var(--text-muted)] uppercase">{title}</span>
      </div>
      <h3 className="text-3xl font-black text-[var(--text-primary)]">
        {isCurrency ? formatCurrency(value) : value}
      </h3>
      <p className={`text-xs mt-2 font-medium ${colorClass}`}>{subtitle}</p>
    </Card>
  );

  return (
    <div className="space-y-6 anim-slide max-w-6xl mx-auto text-[var(--text-primary)]">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-[var(--text-primary)]">System Overview</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Global platform statistics and aggregate financial data.</p>
      </div>

      {/* Top row of Key Performance Indicator (KPI) cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users"
          value={analytics.totalUsers}
          subtitle={`${analytics.userCount} Standard / ${analytics.adminCount} Admins`}
          icon={<FiUsers size={20} />}
          colorClass="text-blue-500 dark:text-blue-400"
          bgColorClass="bg-blue-500/20"
        />

        <StatCard 
          title="Total Income"
          value={analytics.totalIncome}
          subtitle="Platform-wide aggregate"
          icon={<FiTrendingUp size={20} />}
          colorClass="text-emerald-500 dark:text-emerald-400"
          bgColorClass="bg-emerald-500/20"
          isCurrency={true}
        />

        <StatCard 
          title="Total Expense"
          value={analytics.totalExpense}
          subtitle="Platform-wide aggregate"
          icon={<FiTrendingDown size={20} />}
          colorClass="text-red-500 dark:text-red-400"
          bgColorClass="bg-red-500/20"
          isCurrency={true}
        />

        <StatCard 
          title="Net Velocity"
          value={analytics.netBalance}
          subtitle="Income minus Expenses"
          icon={<span className="text-xl font-bold leading-none mt-0.5">₹</span>}
          colorClass="text-purple-500 dark:text-purple-400"
          bgColorClass="bg-purple-500/20"
          isCurrency={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-6 bg-[var(--bg-surface)] border-[var(--border)] shadow-[var(--shadow-md)]">
          <h4 className="font-bold text-md text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <FiActivity className="text-[var(--primary)]" />
            Global Cashflow Distribution
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-[var(--bg-surface)] border-[var(--border)] shadow-[var(--shadow-md)]">
          <h4 className="font-bold text-md text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <FiShield className="text-[var(--primary)]" />
            System Health & Security
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] rounded-lg border border-[var(--border)]">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Database Status</p>
                <p className="text-xs text-[var(--text-secondary)]">MySQL Primary Node</p>
              </div>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded">ONLINE</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] rounded-lg border border-[var(--border)]">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">API Latency</p>
                <p className="text-xs text-[var(--text-secondary)]">Average response time</p>
              </div>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded">42ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] rounded-lg border border-[var(--border)]">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Active Sessions</p>
                <p className="text-xs text-[var(--text-secondary)]">Currently authenticated users</p>
              </div>
              <span className="px-2 py-1 bg-purple-500/20 text-[var(--primary)] text-xs font-bold rounded">{analytics.activeSessions || 1}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
