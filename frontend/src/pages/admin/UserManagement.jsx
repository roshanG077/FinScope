import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { FiSearch, FiShield, FiShieldOff, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch (err) {
      showToast('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.toggleUserStatus(id);
      setUsers(users.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
      showToast('success', `User ${!currentStatus ? 'unblocked' : 'blocked'} successfully`);
    } catch (err) {
      showToast('error', 'Failed to update user status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await api.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      showToast('success', 'User deleted successfully');
    } catch (err) {
      showToast('error', 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 anim-slide max-w-6xl mx-auto text-[var(--text-primary)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">User Management</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">View, modify, and manage all platform accounts.</p>
        </div>
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[var(--primary)] transition-colors"
            placeholder="Search users by name or email..."
          />
        </div>
      </div>

      <Card className="bg-[var(--bg-surface)] border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-card)] text-[var(--text-secondary)] border-b border-[var(--border)] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Joined</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[var(--text-muted)]">
                    <div className="flex justify-center mb-2">
                      <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[var(--text-muted)]">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">{u.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${
                        u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border flex items-center gap-1 w-max ${
                        u.isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                      }`}>
                        {u.isActive ? <FiUserCheck size={10}/> : <FiUserX size={10}/>}
                        {u.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--text-secondary)]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          title={u.isActive ? 'Block User' : 'Unblock User'}
                          onClick={() => handleToggleStatus(u.id, u.isActive)}
                          className={`p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors ${u.isActive ? 'hover:bg-amber-500/20' : 'hover:bg-emerald-500/20'}`}
                        >
                          {u.isActive ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                        </button>
                        <button 
                          title="Delete User"
                          onClick={() => handleDelete(u.id)}
                          className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-red-500/20 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
