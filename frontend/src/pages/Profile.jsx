import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FiUser, FiMail, FiLock, FiSettings, FiCamera } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function Profile() {
  const { user, updateUserLocalState } = useAuth();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.updateProfile(formData);
      updateUserLocalState({ name: res.name });
      showToast('success', 'Profile information updated successfully.');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('error', 'New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.updatePassword({ 
        currentPassword: passwordData.currentPassword, 
        newPassword: passwordData.newPassword 
      });
      showToast('success', 'Password updated successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast('error', err.response?.data?.message || err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 anim-slide max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-[var(--text-primary)]">User Profile</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--success)] flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <FiCamera size={24} className="text-white" />
              </div>
            </div>
            <h3 className="font-bold text-lg text-[var(--text-primary)]">{user?.name}</h3>
            <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
            <div className="mt-4 px-3 py-1 bg-[rgba(99,102,241,0.1)] text-[var(--primary)] text-xs font-semibold rounded-full border border-[var(--primary)]">
              {user?.role || 'PREMIUM USER'}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h4 className="font-bold text-md text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-3">Personal Information</h4>
            <form onSubmit={handleProfileUpdate} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="input-ui !pl-9" 
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input 
                      type="email" 
                      value={formData.email} 
                      disabled
                      className="input-ui !pl-9 opacity-50 cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h4 className="font-bold text-md text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-3">Security & Password</h4>
            <form onSubmit={handlePasswordUpdate} className="space-y-4 text-sm max-w-md">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input 
                    type="password" 
                    required
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="input-ui !pl-9" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input 
                    type="password" 
                    required
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="input-ui !pl-9" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input 
                    type="password" 
                    required
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="input-ui !pl-9" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit" variant="secondary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
