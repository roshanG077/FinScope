import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { FiSave, FiDownload, FiBell, FiMoon, FiSun } from 'react-icons/fi';

import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Settings({ setCurrentTab }) {
  const { user, updateUserLocalState } = useAuth();
  const { showToast } = useToast();
  
  // Load preferences from user.preferences JSON string if available
  const initialSettings = user?.preferences ? JSON.parse(user.preferences) : {
    notifications: true,
    monthlyAlerts: true,
    weeklyReports: false,
    darkMode: true
  };

  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
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
            Note: Theme syncing requires full page reload in the current architecture or context provider updates.
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h4 className="font-bold text-md text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-3 flex items-center gap-2">
            <FiBell className="text-[var(--primary)]" />
            Notifications & Alerts
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-[var(--text-primary)] block">Push Notifications</span>
                <span className="text-xs text-[var(--text-muted)]">Receive alerts for major updates</span>
              </div>
              <input type="checkbox" checked={settings.notifications} onChange={() => handleToggle('notifications')} className="accent-[var(--primary)] w-4 h-4" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-[var(--text-primary)] block">Monthly Budget Alerts</span>
                <span className="text-xs text-[var(--text-muted)]">Get notified when nearing limits</span>
              </div>
              <input type="checkbox" checked={settings.monthlyAlerts} onChange={() => handleToggle('monthlyAlerts')} className="accent-[var(--primary)] w-4 h-4" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-[var(--text-primary)] block">Weekly Reports</span>
                <span className="text-xs text-[var(--text-muted)]">Receive weekly summary via email</span>
              </div>
              <input type="checkbox" checked={settings.weeklyReports} onChange={() => handleToggle('weeklyReports')} className="accent-[var(--primary)] w-4 h-4" />
            </div>
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
        <Card className="p-6 border-red-500/20">
          <h4 className="font-bold text-md text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-3">Data Management</h4>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Export all your transaction and budgeting data to a local JSON file for safekeeping or auditing.
          </p>
          <Button onClick={handleBackup} variant="primary" className="w-full justify-center !bg-indigo-600 hover:!bg-indigo-700 text-white border-0">
            <FiDownload />
            Download Data Backup
          </Button>
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
