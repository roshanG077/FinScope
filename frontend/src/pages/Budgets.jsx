import React from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';

export default function Budgets({ budgets, openAddBudget, openEditBudget, handleDeleteBudget }) {
  const { user } = useAuth();

  const formatCurrency = (val) => {
    const cur = 'INR';
    return new Intl.NumberFormat(cur === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: cur
    }).format(val);
  };

  return (
    <div className="space-y-6 anim-slide">
      {/* Description header and set button */}
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div>
          <h4 className="font-bold text-md text-[var(--text-primary)]">Expense Limits</h4>
          <p className="text-xs text-[var(--text-muted)] mt-1">Keep track of monthly budgets and set maximum caps for specific categories.</p>
        </div>
        <Button 
          onClick={openAddBudget}
          variant="primary"
          className="flex-shrink-0"
        >
          <FiPlus size={16} />
          <span>Set Budget Limit</span>
        </Button>
      </div>

      {/* Grid of Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((b, i) => {
          const isDanger = b.spent > b.amount;
          const isWarning = !isDanger && (b.spent / b.amount) > 0.8;
          const remaining = Math.max(b.amount - b.spent, 0);

          return (
            <Card 
              key={i} 
              glow={isDanger ? 'danger' : isWarning ? 'warning' : 'primary'}
              className="p-6 flex flex-col justify-between"
            >
              {/* Top ceiling highlight bar */}
              {isDanger && <div className="absolute top-0 inset-x-0 h-1 bg-[var(--danger)]"></div>}
              {isWarning && <div className="absolute top-0 inset-x-0 h-1 bg-[var(--warning)]"></div>}

              <div className="flex items-start justify-between mb-4 border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: b.category?.color || '#a0aec0' }}></div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-md text-[var(--text-primary)] truncate max-w-[180px]">{b.name}</h4>
                    <span className="text-xs text-[var(--text-muted)] truncate block">Category: {b.category?.name || 'All'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditBudget(b); }} 
                    className="p-1.5 hover:bg-[var(--hover-bg)] rounded-md text-sky-400 hover:text-[var(--text-primary)] transition-fast"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteBudget(b.id); }} 
                    className="p-1.5 hover:bg-red-500/10 rounded-md text-[var(--danger)] hover:text-red-400 transition-fast"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Stats progress */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Remaining Balance</span>
                    <span className={`text-lg font-bold ${isDanger ? 'text-[var(--danger)]' : 'text-[var(--text-primary)]'}`}>
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Spent / Cap Limit</span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      <strong className={isDanger ? 'text-[var(--danger)]' : isWarning ? 'text-[var(--warning)]' : 'text-[var(--text-secondary)]'}>
                        {formatCurrency(b.spent)}
                      </strong> / {formatCurrency(b.amount)}
                    </span>
                  </div>
                </div>

                {/* Progress bar and metrics */}
                <ProgressBar spent={b.spent} amount={b.amount} />
              </div>
            </Card>
          );
        })}

        {budgets.length === 0 && (
          <div className="col-span-2 fin-card p-12 text-center text-[var(--text-muted)] text-sm flex flex-col items-center justify-center gap-3">
            <FiAlertCircle size={32} className="text-[var(--text-muted)]" />
            <p>No active budget limits defined. Click Set Budget Limit to secure your category spending thresholds!</p>
          </div>
        )}
      </div>
    </div>
  );
}
