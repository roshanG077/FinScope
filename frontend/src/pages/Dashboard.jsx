import React from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

export default function Dashboard({ 
  transactions, 
  budgets, 
  categories, 
  setCurrentTab, 
  openAddTx,
  openEditTx,
  openEditBudget
}) {
  const { user } = useAuth();

  // Step 1: Calculate Core Totals
  // Sum up all transactions marked as 'INCOME'
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Sum up all transactions marked as 'EXPENSE'
  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Calculate what's left over (Net Balance)
  const netBalance = totalIncome - totalExpense;

  // Utility to format numbers into Indian Rupees
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(val);
  };

  // Step 2: Prepare Pie Chart Data (Expenses by Category)
  // Group all expenses by their category name and sum up the amounts
  const expenseByCategory = {};
  transactions
    .filter(t => t.type === 'EXPENSE')
    .forEach(t => {
      const catName = t.category?.name || 'General';
      if (!expenseByCategory[catName]) {
        expenseByCategory[catName] = 0;
      }
      expenseByCategory[catName] += t.amount;
    });

  // Convert the grouped data into an array format suitable for the Recharts library
  const pieData = Object.entries(expenseByCategory).map(([name, value]) => {
    const category = categories.find(c => c.name === name);
    return { 
      name, 
      value: parseFloat(value.toFixed(2)), 
      color: category?.color || '#cbd5e0' 
    };
  });

  // Step 3: Prepare Area Chart Data (Balance Over Time)
  // Sort transactions chronologically, then calculate a running balance
  const areaData = [];
  let runningBalance = 1000; // Starting baseline assumption

  transactions
    .slice() // create a copy before sorting
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(curr => {
      if (curr.type === 'INCOME') {
        runningBalance += curr.amount;
      } else {
        runningBalance -= curr.amount;
      }
      
      areaData.push({
        Date: new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Balance: parseFloat(runningBalance.toFixed(2))
      });
    });

  // Step 4: Prepare Bar Chart Data (Monthly Income vs Expense)
  // Group transactions by Month/Year and accumulate Income and Expense side-by-side
  const monthlyCashflow = {};
  transactions.forEach(curr => {
    const month = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    // Initialize the month if we haven't seen it yet
    if (!monthlyCashflow[month]) {
      monthlyCashflow[month] = { name: month, Income: 0, Expense: 0 };
    }
    
    // Add to the respective column
    if (curr.type === 'INCOME') {
      monthlyCashflow[month].Income += curr.amount;
    } else {
      monthlyCashflow[month].Expense += curr.amount;
    }
  });

  // Convert to array
  const barData = Object.values(monthlyCashflow);

  return (
    <div className="space-y-6 anim-slide">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Balance Card */}
        <Card glow="primary" className="p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-glow)] rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Available Portfolio Balance</span>
            <div className="w-9 h-9 rounded-full bg-[rgba(99,102,241,0.1)] flex items-center justify-center text-[var(--primary)] shadow-sm shrink-0 font-extrabold text-base select-none">
              ₹
            </div>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">{formatCurrency(netBalance)}</h3>
          <p className="text-xs text-[var(--text-muted)] mt-2">Overall assets minus liabilities</p>
        </Card>

        {/* Income Card */}
        <Card glow="success" className="p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--success-glow)] rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Total Monthly Income</span>
            <div className="w-9 h-9 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center text-[var(--success)] shadow-sm shrink-0">
              <FiTrendingUp size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-[var(--success)]">{formatCurrency(totalIncome)}</h3>
          <p className="text-xs text-[var(--text-muted)] mt-2">Active cash flow additions</p>
        </Card>

        {/* Expenses Card */}
        <Card glow="danger" className="p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--danger-glow)] rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Monthly Spendings</span>
            <div className="w-9 h-9 rounded-full bg-[rgba(244,63,94,0.1)] flex items-center justify-center text-[var(--danger)] shadow-sm shrink-0">
              <FiTrendingDown size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-[var(--danger)]">{formatCurrency(totalExpense)}</h3>
          <p className="text-xs text-[var(--text-muted)] mt-2">Active cash flow subtractions</p>
        </Card>

        {/* Savings Card */}
        <Card glow="primary" className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-glow)] rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Net Savings</span>
            <div className="w-9 h-9 rounded-full bg-[rgba(99,102,241,0.1)] flex items-center justify-center text-[var(--primary)] shadow-sm shrink-0">
              <span className="font-extrabold text-sm">%</span>
            </div>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-[var(--primary)]">
            {totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0}%
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-2">Savings rate of total income</p>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-md text-[var(--text-primary)]">Financial Balance Trend</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">Growth of portfolio asset valuations</p>
          </div>
          
          <div className="h-72 w-full mt-4 flex-1">
            {areaData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="Date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="Balance" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#primaryGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">Add active transactions to populate trend analysis</div>
            )}
          </div>
        </Card>

        {/* Categories Distribution */}
        <Card className="p-6 flex flex-col">
          <h4 className="font-bold text-md text-[var(--text-primary)]">Expense Distribution</h4>
          <p className="text-xs text-[var(--text-muted)] mt-1">Spendings sorted by category type</p>
          
          <div className="h-48 w-full relative mt-4 flex-shrink-0">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">No expenses recorded</div>
            )}
          </div>

          {/* Categories Legend List */}
          <div className="flex-1 overflow-y-auto max-h-48 mt-2 space-y-2 pr-1">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[var(--text-secondary)] truncate max-w-[120px]">{item.name}</span>
                </div>
                <span className="font-bold text-[var(--text-primary)]">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Cash Flow Bar Chart */}
      <Card className="p-6">
        <h4 className="font-bold text-md text-[var(--text-primary)]">Monthly Cash Flow Comparison</h4>
        <p className="text-xs text-[var(--text-muted)] mt-1">Income vs Expense analysis</p>
        
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
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

      {/* Budgets & Recent Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Budgets Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
            <h4 className="font-bold text-md text-[var(--text-primary)]">Active Ceilings</h4>
            <button onClick={() => setCurrentTab('budgets')} className="text-xs text-sky-400 font-semibold hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {budgets.slice(0, 3).map((b, i) => (
              <div key={i} onClick={() => openEditBudget(b)} className="space-y-1.5 cursor-pointer hover:bg-[var(--hover-bg)] p-2 rounded-lg transition-fast" title="Click to Modify Budget Ceiling">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--text-secondary)]">{b.name}</span>
                  <span className="text-xs text-[var(--text-muted)]">
                    <strong className={b.spent > b.amount ? 'text-[var(--danger)]' : (b.spent / b.amount) > 0.8 ? 'text-[var(--warning)]' : 'text-[var(--text-primary)]'}>
                      {formatCurrency(b.spent)}
                    </strong> / {formatCurrency(b.amount)}
                  </span>
                </div>
                {/* Visual Bar Indicator */}
                <ProgressBar spent={b.spent} amount={b.amount} />
              </div>
            ))}
            {budgets.length === 0 && (
              <div className="py-8 text-center text-[var(--text-muted)] text-sm">No active budget ceilings set for this month</div>
            )}
          </div>
        </Card>

        {/* Recent Transactions List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
            <h4 className="font-bold text-md text-[var(--text-primary)]">Recent Transactions</h4>
            <button onClick={() => setCurrentTab('transactions')} className="text-xs text-sky-400 font-semibold hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 3).map((tx, idx) => (
              <div key={idx} onClick={() => openEditTx(tx)} className="p-3 bg-[rgba(255,255,255,0.015)] border border-[var(--border)] rounded-lg flex items-center justify-between gap-3 text-sm hover:border-[var(--border-hover)] hover:bg-[var(--hover-bg)] cursor-pointer transition-fast animate-fade" title="Click to Modify Transaction Record">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold shadow-sm" style={{ backgroundColor: `${tx.category?.color || '#a0aec0'}18`, color: tx.category?.color || '#cbd5e0' }}>
                    {tx.category?.name.charAt(0) || 'G'}
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="font-semibold text-[var(--text-primary)] truncate">{tx.description}</h5>
                    <span className="text-xs text-[var(--text-muted)]">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {tx.category?.name}</span>
                  </div>
                </div>
                <Badge variant={tx.type === 'INCOME' ? 'success' : 'danger'}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </Badge>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="py-8 text-center text-[var(--text-muted)] text-sm">No transaction activities logged yet</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
