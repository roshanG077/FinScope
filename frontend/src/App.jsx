import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import AppLayout from './components/layout/AppLayout';
import TransactionModal from './components/modals/TransactionModal';
import BudgetModal from './components/modals/BudgetModal';
import ConfirmModal from './components/modals/ConfirmModal';
import Modal from './components/Modal';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import Income from './pages/Income';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Premium from './pages/Premium';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminSettings from './pages/admin/AdminSettings';
import { api } from './services/api';

function AppContent() {
  const { user, token, isDemo } = useAuth();
  const { showToast } = useToast();
  
  // Navigation states
  const [view, setView] = useState('landing'); // 'landing' or 'app'
  const isAdminView = user?.role === 'ADMIN';
  const [currentTab, setCurrentTab] = useState(isAdminView ? 'admin-dashboard' : 'dashboard');

  // Core data states
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);

  // Modals state
  const [showTxModal, setShowTxModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [activeTabPlan, setActiveTabPlan] = useState('Free'); // Plan tier choice

  // Delete Confirmation State
  const [deleteItem, setDeleteItem] = useState(null);

  // Load portfolio items & Sync navigation view state
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        setCurrentTab('admin-dashboard');
      } else {
        loadAllData();
        setCurrentTab('dashboard');
      }
      setView('app');
    } else {
      setView('landing');
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      const [txList, bList, catList] = await Promise.all([
        api.getTransactions(),
        api.getBudgets(),
        api.getCategories()
      ]);
      setTransactions(txList);
      setBudgets(bList);
      setCategories(catList);
    } catch (err) {
      showToast('error', 'Failed to retrieve active portfolio entries.');
    }
  };

  const handleLaunchApp = (selectedPlan = 'Free') => {
    setActiveTabPlan(selectedPlan);
    setView('app');
  };

  // Landing Page view
  if (view === 'landing') {
    return <LandingPage onLaunchApp={handleLaunchApp} />;
  }

  // Auth Guard for main app
  if (!user) {
    return <Auth />;
  }

  // Transaction Handlers
  const openAddTx = () => {
    setEditingTx(null);
    setShowTxModal(true);
  };

  const openEditTx = (tx) => {
    setEditingTx(tx);
    setShowTxModal(true);
  };

  const handleTxSubmit = async (formData, id = null) => {
    await api.saveTransaction(formData, id);
    await loadAllData();
  };

  const handleDeleteTx = (id) => {
    setDeleteItem({ type: 'tx', id });
  };

  // Budget Handlers
  const openAddBudget = () => {
    setEditingBudget(null);
    setShowBudgetModal(true);
  };

  const openEditBudget = (b) => {
    setEditingBudget(b);
    setShowBudgetModal(true);
  };

  const handleBudgetSubmit = async (formData, id = null) => {
    await api.saveBudget(formData, id);
    await loadAllData();
  };

  const handleDeleteBudget = (id) => {
    setDeleteItem({ type: 'budget', id });
  };

  const executeDelete = async () => {
    if (!deleteItem) return;
    try {
      if (deleteItem.type === 'tx') {
        await api.deleteTransaction(deleteItem.id);
        showToast('success', 'Transaction record deleted successfully.');
      } else if (deleteItem.type === 'budget') {
        await api.deleteBudget(deleteItem.id);
        showToast('success', 'Budget limit deleted successfully.');
      }
      await loadAllData();
    } catch (err) {
      showToast('error', 'Failed to delete record.');
    } finally {
      setDeleteItem(null);
    }
  };

  return (
    <AppLayout 
      currentTab={currentTab} 
      setCurrentTab={setCurrentTab}
      isAdminView={isAdminView}
      AdminSidebar={<AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />}
      onAddTransactionClick={openAddTx}
    >
      {/* 
        Route handling based on user role and selected tab.
        If the user is an admin, we show admin pages. 
        Otherwise, we render the respective user dashboard or features. 
      */}

      {/* Admin Specific Pages */}
      {isAdminView && (
        <>
          {currentTab === 'admin-dashboard' && <AdminDashboard />}
          {currentTab === 'admin-users' && <UserManagement />}
          {currentTab === 'admin-settings' && <AdminSettings />}
        </>
      )}

      {/* Standard User Pages */}
      {!isAdminView && (
        <>
          {currentTab === 'dashboard' && (
            <Dashboard 
              transactions={transactions} 
              budgets={budgets} 
              categories={categories} 
              setCurrentTab={setCurrentTab} 
              openAddTx={openAddTx} 
              openEditTx={openEditTx}
              openEditBudget={openEditBudget}
            />
          )}

          {currentTab === 'transactions' && (
            <Transactions 
              transactions={transactions} 
              categories={categories} 
              openAddTx={openAddTx} 
              openEditTx={openEditTx} 
              handleDeleteTx={handleDeleteTx} 
            />
          )}

          {currentTab === 'budgets' && (
            <Budgets 
              budgets={budgets} 
              openAddBudget={openAddBudget} 
              openEditBudget={openEditBudget} 
              handleDeleteBudget={handleDeleteBudget} 
            />
          )}

          {currentTab === 'reports' && (
            <Reports 
              transactions={transactions} 
              categories={categories} 
            />
          )}

          {currentTab === 'income' && (
            <Income 
              transactions={transactions} 
              categories={categories} 
              openAddTx={openAddTx}
              openEditTx={openEditTx} 
              handleDeleteTx={handleDeleteTx}
            />
          )}

          {currentTab === 'analytics' && <Analytics transactions={transactions} categories={categories} />}
          
          {currentTab === 'profile' && <Profile />}
          
          {currentTab === 'settings' && <Settings setCurrentTab={setCurrentTab} />}

          {currentTab === 'premium' && <Premium />}
        </>
      )}

      {/* Global popups and modals */}

      <TransactionModal
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
        onSubmit={handleTxSubmit}
        editingTx={editingTx}
        categories={categories}
      />

      <BudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSubmit={handleBudgetSubmit}
        editingBudget={editingBudget}
        categories={categories}
      />

      <ConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={executeDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${deleteItem?.type === 'tx' ? 'transaction' : 'budget'}? This action cannot be undone.`}
      />


    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
