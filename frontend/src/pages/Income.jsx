import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { FiPlus, FiFilter, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Income({ 
  transactions, 
  categories, 
  openAddTx, 
  openEditTx, 
  handleDeleteTx 
}) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  
  // Filter for income only
  const incomes = transactions.filter(t => t.type === 'INCOME');
  
  const formatCurrency = (val) => {
    const cur = 'INR';
    return new Intl.NumberFormat(cur === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: cur
    }).format(val);
  };

  const filteredIncomes = incomes.filter(t => 
    t.description?.toLowerCase().includes(search.toLowerCase()) || 
    t.note?.toLowerCase().includes(search.toLowerCase())
  );

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  // Data for chart
  const areaData = incomes
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, curr) => {
      const dateStr = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = acc.find(item => item.Date === dateStr);
      if (existing) {
        existing.Income += curr.amount;
      } else {
        acc.push({ Date: dateStr, Income: curr.amount });
      }
      return acc;
    }, []);

  return (
    <div className="space-y-6 anim-slide">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Income Tracking</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">Manage your Salary, Freelance, and Business streams.</p>
        </div>
        <Button onClick={openAddTx} variant="success">
          <FiPlus size={16} />
          <span>Add Income Source</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg md:col-span-1 flex flex-col justify-center">
           <span className="text-sm font-semibold text-[var(--text-secondary)] block mb-2">Total Monthly Income</span>
           <h3 className="text-4xl font-black text-[var(--success)]">{formatCurrency(totalIncome)}</h3>
        </div>
        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg md:col-span-2 h-40">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="Date" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Area type="monotone" dataKey="Income" stroke="var(--success)" strokeWidth={3} fill="url(#successGrad)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-muted)] pointer-events-none">
            <FiSearch size={14} />
          </span>
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-ui !pl-9 !py-1.5"
            placeholder="Search income records..."
          />
        </div>
      </div>

      <div className="table-wrapper shadow-md">
        <div className="overflow-x-auto">
          <table className="table-ui">
            <thead>
              <tr>
                <th>Source</th>
                <th>Category</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredIncomes.map((tx, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="overflow-hidden">
                        <h5 className="font-semibold text-[var(--text-primary)] truncate max-w-[220px]">{tx.description}</h5>
                        {tx.note && <p className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">{tx.note}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(255,255,255,0.02)] border border-[var(--border)]">
                      <span className="text-[var(--text-secondary)]">{tx.category?.name || 'Income'}</span>
                    </span>
                  </td>
                  <td className="text-xs text-[var(--text-secondary)] font-medium">
                    {new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="text-right font-bold text-[15px]">
                    <Badge variant="success">+{formatCurrency(tx.amount)}</Badge>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEditTx(tx)} className="p-2 hover:bg-[var(--hover-bg)] rounded-md text-sky-400 hover:text-[var(--text-primary)] transition-fast">
                        <FiEdit2 size={13} />
                      </button>
                      <button onClick={() => handleDeleteTx(tx.id)} className="p-2 hover:bg-red-500/10 rounded-md text-[var(--danger)] hover:text-red-400 transition-fast">
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredIncomes.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-[var(--text-muted)]">No income entries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
