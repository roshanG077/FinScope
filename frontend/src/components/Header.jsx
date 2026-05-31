import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMenu, FiPlus, FiActivity, FiSun, FiMoon } from 'react-icons/fi';

export default function Header({ currentTab, setSidebarOpen, onAddTransactionClick, isAdminView }) {
  const { isDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--glass-bg)] backdrop-filter backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(true)} className="xl:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-fast">
          <FiMenu size={22} />
        </button>
        <h2 className="text-xl font-bold tracking-wide capitalize bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
          {currentTab}
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-fast"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
        </button>

        {/* Quick Add Button */}
        {!isAdminView && (
          <button 
            onClick={onAddTransactionClick}
            className="btn-ui btn-variant-primary !py-1.5 !px-3.5 !rounded-md !text-xs"
          >
            <FiPlus size={14} />
            <span>Add Record</span>
          </button>
        )}
      </div>
    </header>
  );
}
