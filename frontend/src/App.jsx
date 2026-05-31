import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import AppLayout from './components/layout/AppLayout';
import TransactionModal from './components/modals/TransactionModal';
import BudgetModal from './components/modals/BudgetModal';
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

  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [activeTabPlan, setActiveTabPlan] = useState('Free'); // Plan tier choice

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

  const handleDeleteTx = async (id) => {
    try {
      await api.deleteTransaction(id);
      showToast('success', 'Transaction record deleted successfully.');
      await loadAllData();
    } catch (err) {
      showToast('error', 'Failed to delete transaction record.');
    }
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

  const handleDeleteBudget = async (id) => {
    try {
      await api.deleteBudget(id);
      showToast('success', 'Budget limit deleted successfully.');
      await loadAllData();
    } catch (err) {
      showToast('error', 'Failed to delete budget limit.');
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
              onAdviceHubClick={() => setShowAdvisorModal(true)}
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

      {/* The AI Wealth Advisor popup feature */}
      <Modal
        isOpen={showAdvisorModal}
        onClose={() => setShowAdvisorModal(false)}
        title="Aura Wealth Advisor (AI)"
      >
        <div className="space-y-4 text-xs leading-relaxed text-[var(--text-secondary)]">
          <div className="p-3 bg-[rgba(99,102,241,0.06)] border border-[var(--primary)] text-[var(--primary)] rounded-md font-semibold text-center uppercase tracking-wider">
            Premium Indian Investment Insights
          </div>

          <div className="space-y-3.5 divide-y divide-[var(--border)]">
            <div className="space-y-1 pt-1">
              <span className="font-bold text-emerald-400 block text-xs">Section 80C Tax Planning</span>
              <p>Maximize your Old Regime tax savings! Save up to **₹46,800/year** in taxes by investing up to **₹1,50,000** in **ELSS Mutual Funds** (lock-in: 3 years) vs standard **PPF** (lock-in: 15 years, fixed 7.1% tax-free interest). Compare these options under the advice of your CA.</p>
            </div>
            
            <div className="space-y-1 pt-3.5">
              <span className="font-bold text-sky-400 block text-xs">Emergency Shield Formula</span>
              <p>We recommend building an emergency reserve equal to **6 months** of expenses. Given your active budgets, maintain at least **₹1,50,000** in highly liquid instruments like High-Yield Savings Accounts or Liquid Debt Funds before leveraging equity portfolios.</p>
            </div>

            <div className="space-y-1 pt-3.5">
              <span className="font-bold text-amber-400 block text-xs">Systematic Investment Plan (SIP)</span>
              <p>Automate your wealth. Configure your mutual fund and stock SIPs on the **5th of every month** (right after salary payout). This secures consistent long-term compound growth of **12-15%** under typical Indian market indices (Nifty 50).</p>
            </div>
          </div>

          <button 
            onClick={() => setShowAdvisorModal(false)}
            className="w-full btn-ui btn-variant-primary !py-2 !rounded-md mt-2 font-bold"
          >
            Acknowledge Insights
          </button>
        </div>
      </Modal>
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
