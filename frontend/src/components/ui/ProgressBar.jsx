import React from 'react';

export default function ProgressBar({ spent, amount }) {
  const pct = Math.min((spent / amount) * 100, 100);
  const isDanger = spent > amount;
  const isWarning = !isDanger && (spent / amount) > 0.8;

  return (
    <div className="space-y-1">
      {/* Progress Track */}
      <div className="w-full h-2.5 bg-bg-main rounded-full overflow-hidden border border-[var(--border)]">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${isDanger ? 'bg-[var(--danger)]' : isWarning ? 'bg-[var(--warning)]' : 'bg-[var(--primary)]'}`}
          style={{ width: `${pct}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-medium">
        <span>0%</span>
        <span className={isDanger ? 'text-[var(--danger)] font-bold' : isWarning ? 'text-[var(--warning)] font-bold' : ''}>
          {pct.toFixed(0)}% consumed
        </span>
        <span>100%</span>
      </div>
    </div>
  );
}
