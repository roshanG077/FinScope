import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { FiSave, FiDownload, FiBell, FiMoon, FiSun, FiLock } from 'react-icons/fi';

import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings({ setCurrentTab }) {
  const { user, updateUserLocalState } = useAuth();
  const { showToast } = useToast();
  
  const { theme, toggleTheme } = useTheme();
  
  // Load preferences from user.preferences JSON string if available
  const initialSettings = user?.preferences ? JSON.parse(user.preferences) : {
    notifications: true,
    monthlyAlerts: true,
    weeklyReports: false,
    darkMode: theme === 'dark'
  };

  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    if (key === 'darkMode') {
      toggleTheme();
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const preferencesJson = JSON.stringify(settings);
      await api.updateSettings({ preferences: preferencesJson });
      updateUserLocalState({ preferences: preferencesJson });
      showToast('success', 'Application settings saved successfully.');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      message: "FinScope Backup Data",
      timestamp: new Date().toISOString()
    }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "finscope_backup_" + new Date().getTime() + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast('success', 'Backup exported successfully.');
  };

  return (
    <div className="space-y-6 anim-slide max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-[var(--text-primary)]">Application Settings</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">Configure your app preferences and features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Appearance & Theme */}
        <Card className="p-6">
          <h4 className="font-bold text-md text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-3">Appearance</h4>
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-semibold text-sm text-[var(--text-primary)] block">Theme Preference</span>
              <span className="text-xs text-[var(--text-muted)]">Switch between dark and light mode</span>
            </div>
            <button 
              onClick={() => handleToggle('darkMode')}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.darkMode ? 'bg-[var(--primary)]' : 'bg-gray-400'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform flex items-center justify-center ${settings.darkMode ? 'translate-x-7' : 'translate-x-1'}`}>
                {settings.darkMode ? <FiMoon size={10} className="text-[var(--primary)]"/> : <FiSun size={10} className="text-amber-500"/>}
              </div>
            </button>
          </div>
          <div className="mt-4 p-3 bg-[rgba(255,255,255,0.03)] border border-[var(--border)] rounded text-xs text-[var(--text-secondary)]">
            Your theme preference syncs instantly across the application and is saved securely.
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h4 className="font-bold text-md text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-3 flex items-center gap-2">
            <FiBell className="text-[var(--primary)]" />
            Notifications & Alerts
          </h4>
          
          <div className="space-y-4 opacity-70" title="Notification services are currently under development. Coming soon!">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">Push Notifications <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider flex items-center gap-1"><FiLock size={10} /> Premium</span></span>
                <span className="text-xs text-[var(--text-muted)]">Receive alerts for major updates</span>
              </div>
              <input type="checkbox" disabled checked={settings.notifications} onChange={() => handleToggle('notifications')} className="accent-[var(--primary)] w-4 h-4 cursor-not-allowed" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">Monthly Budget Alerts <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider flex items-center gap-1"><FiLock size={10} /> Premium</span></span>
                <span className="text-xs text-[var(--text-muted)]">Get notified when nearing limits</span>
              </div>
              <input type="checkbox" disabled checked={settings.monthlyAlerts} onChange={() => handleToggle('monthlyAlerts')} className="accent-[var(--primary)] w-4 h-4 cursor-not-allowed" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">Weekly Reports <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider flex items-center gap-1"><FiLock size={10} /> Premium</span></span>
                <span className="text-xs text-[var(--text-muted)]">Receive weekly summary via email</span>
              </div>
              <input type="checkbox" disabled checked={settings.weeklyReports} onChange={() => handleToggle('weeklyReports')} className="accent-[var(--primary)] w-4 h-4 cursor-not-allowed" />
            </div>
            <p className="text-xs text-amber-500 mt-2 font-medium">Note: Notification services will become available with FinScope Premium in future releases.</p>
          </div>
        </Card>

        {/* Budget Management Link */}
        <Card className="p-6">
          <h4 className="font-bold text-md text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-3">Financial Planning</h4>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Configure your spending ceilings and monthly allocation limits across different categories to maintain financial discipline.
          </p>
          <Button onClick={() => setCurrentTab('budgets')} variant="secondary" className="w-full justify-center">
            Manage Budget Limits
          </Button>
        </Card>

        {/* Data Management */}
        <Card className="p-6 border-red-500/20 opacity-70" title="Full database export feature is under active development.">
          <h4 className="font-bold text-md text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-3 flex justify-between items-center">
            Data Management
            <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider flex items-center gap-1"><FiLock size={10} /> Premium</span>
          </h4>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Export all your transaction and budgeting data to a local JSON file for safekeeping or auditing.
          </p>
          <Button disabled onClick={() => {}} variant="primary" className="w-full justify-center !bg-[var(--hover-bg)] hover:!bg-[var(--hover-bg)] text-[var(--text-muted)] border-0 cursor-not-allowed">
            <FiDownload />
            Export Data (Premium Only)
          </Button>
          <p className="text-xs text-indigo-400 mt-3 font-medium text-center">Export service is coming soon!</p>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={saveSettings} variant="primary" disabled={loading}>
          <FiSave />
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
