import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { FiSave, FiSettings, FiShield, FiMail, FiGlobe } from 'react-icons/fi';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    platformName: 'FinScope Cloud',
    supportEmail: 'support@finscope.com',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: false,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      showToast('success', 'System configurations updated successfully.');
    }, 800);
  };

    // Helper component to render a consistent toggle switch row
    const ToggleSwitch = ({ label, description, stateKey, isWarning }) => (
      <>
        <label className="flex items-center justify-between cursor-pointer group">
          <div>
            <span className="block text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
              {label}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">{description}</span>
          </div>
          
          <div className="relative">
            {/* Hidden accessibility input */}
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={settings[stateKey]} 
              onChange={() => handleToggle(stateKey)} 
            />
            {/* Visual background track */}
            <div className={`block w-10 h-6 rounded-full transition-colors ${
              settings[stateKey] 
                ? (isWarning ? 'bg-amber-500' : 'bg-[var(--primary)]') 
                : 'bg-gray-600 dark:bg-gray-700'
            }`}></div>
            {/* Visual sliding dot */}
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
              settings[stateKey] ? 'translate-x-4' : ''
            }`}></div>
          </div>
        </label>
      </>
    );

    return (
      <div className="space-y-6 anim-slide max-w-4xl mx-auto text-[var(--text-primary)]">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">System Configuration</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Manage global platform settings, access controls, and maintenance operations.</p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-[var(--surface-color)] border-[var(--border)]">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                <FiGlobe className="text-[var(--primary)]" />
                General Platform Details
              </h3>
              
              <div className="space-y-4">
                {/* Platform Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Platform Name</label>
                  <input 
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="input-ui !bg-[rgba(0,0,0,0.02)] dark:!bg-[rgba(255,255,255,0.02)]"
                  />
                </div>
                
                {/* Support Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Support Email</label>
                  <input 
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="input-ui !bg-[rgba(0,0,0,0.02)] dark:!bg-[rgba(255,255,255,0.02)]"
                  />
                </div>
              </div>
            </Card>
          </div>
  
          <div className="space-y-6">
            <Card className="p-6 bg-[var(--surface-color)] border-[var(--border)]">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                <FiShield className="text-[var(--primary)]" />
                Access & Security
              </h3>
              
              <div className="space-y-4">
                {/* Security Toggles */}
                <ToggleSwitch 
                  label="Maintenance Mode"
                  description="Lock all non-admin users out of the platform"
                  stateKey="maintenanceMode"
                  isWarning={true}
                />
                
                <div className="h-px bg-[var(--border)]"></div>
  
                <ToggleSwitch 
                  label="Allow New Registrations"
                  description="Open platform for public signups"
                  stateKey="allowRegistrations"
                />
  
                <div className="h-px bg-[var(--border)]"></div>
  
                <ToggleSwitch 
                  label="Require Email Verification"
                  description="Force verification before account activation"
                  stateKey="requireEmailVerification"
                />
              </div>
            </Card>
          </div>
        </div>

      <div className="flex justify-end pt-4">
        <Button 
          variant="primary" 
          onClick={handleSave} 
          disabled={loading}
          className="px-6"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FiSave />
              Apply System Changes
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
