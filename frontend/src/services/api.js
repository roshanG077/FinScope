import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://finscope-production-8816.up.railway.app';

const API_CLIENT = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 5000
});

// Auto inject JWT token from localStorage
API_CLIENT.interceptors.request.use((config) => {
  const token = localStorage.getItem('finscope_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Custom mock categories
export const MOCK_CATEGORIES = [
  { id: 1, name: 'Food & Dining', icon: 'utensils', color: '#ff6b6b', type: 'EXPENSE' },
  { id: 2, name: 'Transportation', icon: 'car', color: '#4ecdc4', type: 'EXPENSE' },
  { id: 3, name: 'Shopping', icon: 'shopping-bag', color: '#45b7d1', type: 'EXPENSE' },
  { id: 4, name: 'Entertainment', icon: 'film', color: '#96ceb4', type: 'EXPENSE' },
  { id: 5, name: 'Bills & Utilities', icon: 'zap', color: '#54a0ff', type: 'EXPENSE' },
  { id: 6, name: 'Salary', icon: 'briefcase', color: '#1dd1a1', type: 'INCOME' },
  { id: 7, name: 'Freelance', icon: 'code', color: '#10ac84', type: 'INCOME' },
  { id: 8, name: 'Investments', icon: 'trending-up', color: '#f368e0', type: 'INCOME' }
];

// Fallback memory state for Simulation Mode
let simulatedTransactions = [
  { id: 1, userId: 2, amount: 125000.00, type: 'INCOME', description: 'Monthly Tech Salary', date: '2026-05-01', category: MOCK_CATEGORIES[5], note: 'Direct deposit from Tata Tech' },
  { id: 2, userId: 2, amount: 1250.50, type: 'EXPENSE', description: 'Swiggy Instamart Order', date: '2026-05-03', category: MOCK_CATEGORIES[0], note: 'Weekly Groceries' },
  { id: 3, userId: 2, amount: 2500.00, type: 'EXPENSE', description: 'Uber Cabs India', date: '2026-05-04', category: MOCK_CATEGORIES[1], note: 'Office commute' },
  { id: 4, userId: 2, amount: 4500.00, type: 'EXPENSE', description: 'Zara Myntra Shopping', date: '2026-05-08', category: MOCK_CATEGORIES[2], note: 'Summer apparel' },
  { id: 5, userId: 2, amount: 649.00, type: 'EXPENSE', description: 'Netflix India Premium', date: '2026-05-10', category: MOCK_CATEGORIES[3], note: 'Monthly premium' },
  { id: 6, userId: 2, amount: 35000.00, type: 'INCOME', description: 'Website Redesign Project', date: '2026-05-12', category: MOCK_CATEGORIES[6], note: 'Freelance Indian Client' },
  { id: 7, userId: 2, amount: 2400.00, type: 'EXPENSE', description: 'Tata Power Electricity Bill', date: '2026-05-15', category: MOCK_CATEGORIES[4], note: 'Online UPI Payout' },
  { id: 8, userId: 2, amount: 3800.00, type: 'EXPENSE', description: 'Zomato Dineout Party', date: '2026-05-18', category: MOCK_CATEGORIES[0], note: 'Weekend Dinner' },
  { id: 9, userId: 2, amount: 1200.00, type: 'EXPENSE', description: 'PVR Cinema Tickets', date: '2026-05-20', category: MOCK_CATEGORIES[3], note: 'IMAX movie' },
  { id: 10, userId: 2, amount: 5000.00, type: 'INCOME', description: 'Groww Mutual Fund Dividend', date: '2026-05-24', category: MOCK_CATEGORIES[7], note: 'ELSS Tax Saver Fund' }
];

let simulatedBudgets = [
  { id: 1, userId: 2, name: 'Monthly Dining Out', amount: 15000.00, month: 5, year: 2026, category: MOCK_CATEGORIES[0], spent: 5050.50 },
  { id: 2, userId: 2, name: 'Transport Budget', amount: 8000.00, month: 5, year: 2026, category: MOCK_CATEGORIES[1], spent: 2500.00 },
  { id: 3, userId: 2, name: 'Shopping Limit', amount: 12000.00, month: 5, year: 2026, category: MOCK_CATEGORIES[2], spent: 4500.00 },
  { id: 4, userId: 2, name: 'Entertainment Cap', amount: 5000.00, month: 5, year: 2026, category: MOCK_CATEGORIES[3], spent: 1849.00 }
];

let simulatedUsers = [
  { id: 1, name: 'Admin User', email: 'admin@finscope.com', role: 'ADMIN', isActive: true, createdAt: '2026-01-15T10:00:00' },
  { id: 2, name: 'Demo User', email: 'demo@finscope.com', role: 'USER', isActive: true, createdAt: '2026-02-20T14:30:00' },
  { id: 3, name: 'John Doe', email: 'john@example.com', role: 'USER', isActive: false, createdAt: '2026-03-10T09:15:00' },
  { id: 4, name: 'Priya Sharma', email: 'priya@example.com', role: 'USER', isActive: true, createdAt: '2026-04-05T16:45:00' }
];

// Master API wrapper: handles API errors by automatically converting to Mock Mode
export const api = {
  isSimulated: false,

  async login(email, password) {
    try {
      const res = await API_CLIENT.post('/auth/login', { email, password });
      this.isSimulated = false;
      return res.data;
    } catch (err) {
      if (!err.response) { // Network error or connection refused
        this.isSimulated = true;
        const user = simulatedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
          throw new Error('User not found in simulation mode.');
        }
        return {
          token: 'simulated_jwt_token',
          ...user
        };
      }
      this.isSimulated = false;
      throw err;
    }
  },

  async register(name, email, password, phone) {
    try {
      const res = await API_CLIENT.post('/auth/register', { name, email, password, phone });
      return res.data;
    } catch (err) {
      if (!err.response) { // Network error or connection refused
        this.isSimulated = true;
        const newId = simulatedUsers.length > 0 ? Math.max(...simulatedUsers.map(u => u.id)) + 1 : 1;
        const newUser = { id: newId, name, email, role: 'USER', isActive: true, createdAt: new Date().toISOString() };
        simulatedUsers.push(newUser);
        return {
          token: 'simulated_jwt_token',
          ...newUser
        };
      }
      throw err;
    }
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('finscope_user') || '{}');
  },

  async getTransactions() {
    if (this.isSimulated) {
      const user = this.getCurrentUser();
      return simulatedTransactions.filter(t => t.userId === user.id);
    }
    const res = await API_CLIENT.get('/transactions');
    return res.data;
  },
  
  async saveTransaction(txData, id = null) {
    if (this.isSimulated) {
      const user = this.getCurrentUser();
      if (id) {
        const index = simulatedTransactions.findIndex(t => t.id === id);
        if (index !== -1) simulatedTransactions[index] = { ...simulatedTransactions[index], ...txData };
        return simulatedTransactions[index];
      }
      const newTx = { ...txData, id: Date.now(), userId: user.id };
      simulatedTransactions.unshift(newTx);
      return newTx;
    }
    if (id) {
      const res = await API_CLIENT.put(`/transactions/${id}`, txData);
      return res.data;
    } else {
      const res = await API_CLIENT.post('/transactions', txData);
      return res.data;
    }
  },
  
  async deleteTransaction(id) {
    if (this.isSimulated) {
      simulatedTransactions = simulatedTransactions.filter(t => t.id !== id);
      return { success: true };
    }
    const res = await API_CLIENT.delete(`/transactions/${id}`);
    return res.data;
  },
  
  async getBudgets() {
    if (this.isSimulated) {
      const user = this.getCurrentUser();
      return simulatedBudgets.filter(b => b.userId === user.id);
    }
    const res = await API_CLIENT.get('/budgets/current');
    return res.data.map(b => ({
      id: b.id,
      name: b.name || 'Budget limit',
      amount: b.amount,
      spent: b.spent || 0,
      category: typeof b.category === 'object' && b.category !== null 
        ? b.category 
        : { name: b.category || 'General', color: b.categoryColor || '#4f9cf9' },
      month: b.month,
      year: b.year
    }));
  },
  
  async saveBudget(budgetData, id = null) {
    if (this.isSimulated) {
      const user = this.getCurrentUser();
      if (id) {
        const index = simulatedBudgets.findIndex(b => b.id === id);
        if (index !== -1) simulatedBudgets[index] = { ...simulatedBudgets[index], ...budgetData };
        return simulatedBudgets[index];
      }
      const newBudget = { ...budgetData, id: Date.now(), userId: user.id, spent: 0 };
      simulatedBudgets.unshift(newBudget);
      return newBudget;
    }
    if (id) {
      const res = await API_CLIENT.put(`/budgets/${id}`, budgetData);
      return res.data;
    } else {
      const res = await API_CLIENT.post('/budgets', budgetData);
      return res.data;
    }
  },
  
  async deleteBudget(id) {
    if (this.isSimulated) {
      simulatedBudgets = simulatedBudgets.filter(b => b.id !== id);
      return { success: true };
    }
    const res = await API_CLIENT.delete(`/budgets/${id}`);
    return res.data;
  },
  
  async getCategories() {
    try {
      const res = await API_CLIENT.get('/categories');
      return res.data || MOCK_CATEGORIES;
    } catch (err) {
      return MOCK_CATEGORIES;
    }
  },

  async updateProfile(data) {
    if (this.isSimulated) {
      const user = JSON.parse(localStorage.getItem('finscope_user') || '{}');
      const updatedUser = { ...user, name: data.name };
      localStorage.setItem('finscope_user', JSON.stringify(updatedUser));
      return { message: 'Profile updated successfully', name: data.name };
    }
    const res = await API_CLIENT.put('/users/profile', data);
    return res.data;
  },

  async updatePassword(data) {
    if (this.isSimulated) {
      if (data.currentPassword === 'incorrect') throw new Error('Current password is incorrect');
      return { message: 'Password updated successfully' };
    }
    const res = await API_CLIENT.put('/users/password', data);
    return res.data;
  },

  async updateSettings(data) {
    if (this.isSimulated) {
      const user = JSON.parse(localStorage.getItem('finscope_user') || '{}');
      const updatedUser = { ...user, preferences: data.preferences };
      localStorage.setItem('finscope_user', JSON.stringify(updatedUser));
      return { message: 'Settings updated successfully', preferences: data.preferences };
    }
    const res = await API_CLIENT.put('/users/settings', data);
    return res.data;
  },

  // Admin Routes
  async getAdminAnalytics() {
    if (this.isSimulated) {
      return {
        totalUsers: simulatedUsers.length,
        adminCount: simulatedUsers.filter(u => u.role === 'ADMIN').length,
        userCount: simulatedUsers.filter(u => u.role === 'USER').length,
        totalIncome: simulatedTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0),
        totalExpense: simulatedTransactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0),
        netBalance: simulatedTransactions.reduce((acc, t) => t.type === 'INCOME' ? acc + t.amount : acc - t.amount, 0)
      };
    }
    const res = await API_CLIENT.get('/admin/analytics');
    return res.data;
  },

  async getAdminUsers() {
    if (this.isSimulated) return [...simulatedUsers];
    const res = await API_CLIENT.get('/admin/users');
    return res.data;
  },

  async toggleUserStatus(id) {
    if (this.isSimulated) {
      const index = simulatedUsers.findIndex(u => u.id === id);
      if (index !== -1) simulatedUsers[index].isActive = !simulatedUsers[index].isActive;
      return simulatedUsers[index];
    }
    const res = await API_CLIENT.put(`/admin/users/${id}/status`);
    return res.data;
  },

  async updateUserRole(id, role) {
    if (this.isSimulated) {
      const index = simulatedUsers.findIndex(u => u.id === id);
      if (index !== -1) simulatedUsers[index].role = role;
      return simulatedUsers[index];
    }
    const res = await API_CLIENT.put(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  async deleteUser(id) {
    if (this.isSimulated) {
      simulatedUsers = simulatedUsers.filter(u => u.id !== id);
      return { success: true };
    }
    const res = await API_CLIENT.delete(`/admin/users/${id}`);
    return res.data;
  }
};
