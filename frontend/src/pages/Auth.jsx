import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogoIcon } from '../components/ui/Logo';
import { FiMail, FiLock, FiUser, FiPhone, FiAlertCircle } from 'react-icons/fi';

export default function Auth({ inline = false }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currency, setCurrency] = useState('INR');

  // Status values
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Perform standard form validations before sending to backend
    
    // 1. Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // 2. Validate Password Length
    if (password.length < 6 || password.length > 40) {
      setError('Password must be between 6 and 40 characters long.');
      return;
    }

    // 3. Validate Registration Specific Fields
    if (!isLogin) {
      if (name.trim().length < 2 || name.trim().length > 100) {
        setError('Full Name must be between 2 and 100 characters long.');
        return;
      }
      
      if (phone.trim()) {
        const cleanPhone = phone.replace(/[\s-]/g, '');
        const indianPhoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
        if (!indianPhoneRegex.test(cleanPhone)) {
          setError('Please enter a valid 10-digit Indian mobile number (e.g. +91 98765 43210).');
          return;
        }
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, phone, currency);
        setSuccess('Registration successful! Please log in using your credentials.');
        setIsLogin(true);
      }
    } catch (err) {
      const backendError = err.response?.data?.message || err.response?.data?.error;
      let errorText = typeof backendError === 'string' ? backendError : err.message;
      if (errorText?.includes('status code 500') || errorText?.includes('status code 401') || errorText?.includes('Network Error')) {
        errorText = 'Invalid email or password. Please try again.';
      }
      setError(errorText || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };



  const renderCard = () => (
    <div className="w-full max-w-md glass-surface border border-[var(--glass-border)] p-8 rounded-lg relative z-10 shadow-[var(--shadow-lg)]">
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto flex items-center justify-center mb-4">
          <LogoIcon className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          FinScope
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-2 font-semibold">India's Smartest Portfolio & Expense Triage</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-muted)] pointer-events-none">
                <FiUser size={16} />
              </span>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="fin-input !pl-10"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-muted)] pointer-events-none">
              <FiMail size={16} />
            </span>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="fin-input !pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-muted)] pointer-events-none">
              <FiLock size={16} />
            </span>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="fin-input !pl-10"
            />
          </div>
        </div>

        {!isLogin && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-muted)] pointer-events-none">
                  <FiPhone size={14} />
                </span>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  className="fin-input !pl-8"
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-md flex items-start gap-2.5 leading-relaxed">
            <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-md flex items-start gap-2.5 leading-relaxed">
            <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
            <span>{success}</span>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn btn-primary mt-2"
        >
          {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Portfolio'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        {isLogin ? (
          <p>
            New to FinScope?{' '}
            <button type="button" onClick={() => { setIsLogin(false); setError(''); }} className="text-sky-400 font-semibold hover:underline">
              Create an account
            </button>
          </p>
        ) : (
          <p>
            Already registered?{' '}
            <button type="button" onClick={() => { setIsLogin(true); setError(''); }} className="text-sky-400 font-semibold hover:underline">
              Sign In
            </button>
          </p>
        )}
      </div>

    </div>
  );

  if (inline) {
    return renderCard();
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#050812] px-4 py-12 relative overflow-hidden animate-fade">
      {/* Decorative Blur Background Blobs */}
      <div className="absolute top-[10%] left-[15%] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[15%] w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      {renderCard()}
    </div>
  );
}
