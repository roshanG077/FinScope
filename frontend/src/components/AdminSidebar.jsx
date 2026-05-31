import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiUsers, FiSettings, FiLogOut, FiRepeat } from 'react-icons/fi';
import { LogoIcon } from './ui/Logo';

export default function AdminSidebar({ currentTab, setCurrentTab, toggleView }) {
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'admin-dashboard', icon: <FiGrid size={20} />, label: 'Overview' },
    { id: 'admin-users', icon: <FiUsers size={20} />, label: 'User Management' },
    { id: 'admin-settings', icon: <FiSettings size={20} />, label: 'System Settings' }
  ];

  return (
    <div className="w-64 h-full bg-[var(--bg-surface)] border-r border-[var(--border)] flex flex-col transition-all">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
          <LogoIcon className="w-full h-full drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-[var(--text-primary)]">FinScope</h1>
          <p className="text-[10px] uppercase font-bold text-[var(--primary)] tracking-widest">Admin Console</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold text-[var(--text-muted)] mb-2 px-2 uppercase tracking-wider">Management</div>
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-purple-500/10 text-[var(--primary)] border border-purple-500/20 shadow-[inset_0_0_12px_rgba(168,85,247,0.1)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)]'
              }`}
            >
              <div className={isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}>
                {item.icon}
              </div>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        <div className="mb-4 px-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-[var(--primary)] font-bold border border-purple-500/30">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user?.name}</p>
            <p className="text-xs text-[var(--primary)] truncate font-medium">Administrator</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <FiLogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
