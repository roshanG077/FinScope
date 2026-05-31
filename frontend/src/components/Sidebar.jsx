import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogoIcon } from './ui/Logo';
import { 
  FiGrid, FiList, FiCreditCard, FiPieChart, FiLogOut, FiX, FiTrendingUp, FiUser, FiSettings, FiBarChart2 
} from 'react-icons/fi';

export default function Sidebar({ currentTab, setCurrentTab, sidebarOpen, setSidebarOpen }) {
  const { user, logout, isDemo } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiGrid size={18} /> },
    { id: 'transactions', label: 'Expenses', icon: <FiList size={18} /> },
    { id: 'income', label: 'Income', icon: <FiTrendingUp size={18} /> },
    { id: 'budgets', label: 'Budgets', icon: <FiCreditCard size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 size={18} /> },
    { id: 'reports', label: 'Reports', icon: <FiPieChart size={18} /> },
    { id: 'profile', label: 'Profile', icon: <FiUser size={18} /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings size={18} /> }
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-surface border-r border-[var(--border)] flex flex-col transition-transform duration-300 xl:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:static'}`}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <LogoIcon className="w-full h-full drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-secondary)] to-[var(--text-muted)] bg-clip-text text-transparent">FinScope</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="xl:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-fast">
          <FiX size={20} />
        </button>
      </div>

      {/* User Info profile widget */}
      <div className="p-4 mx-3 my-4 bg-[rgba(255,255,255,0.02)] border border-[var(--border)] rounded-lg flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--success)] flex items-center justify-center text-white font-bold text-md shadow-md">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="overflow-hidden">
          <h4 className="font-semibold text-sm truncate text-[var(--text-primary)]">{user?.name}</h4>
          <span className="text-xs text-[var(--text-muted)] truncate block">{user?.email}</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => { setCurrentTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-fast ${currentTab === item.id ? 'bg-[rgba(99,102,241,0.12)] text-[var(--primary)] border-l-4 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Banner */}
      <div className="p-4 border-t border-[var(--border)]">
        {isDemo && (
          <div className="mb-4 p-3 bg-[rgba(99,102,241,0.06)] border border-[var(--border)] rounded-lg text-[10px] text-[var(--text-secondary)] leading-relaxed">
            <span className="font-bold text-[var(--primary)] block mb-0.5">Simulation Active</span>
            Connected via client-side cached databases because local MySQL is unconnected.
          </div>
        )}

        <button  
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 border border-red-500/20 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-fast"
        >
          <FiLogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
