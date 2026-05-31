import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, duration = 3500) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Toast floating container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isDanger = toast.type === 'error';
          const isWarning = toast.type === 'warning';
          
          return (
            <div 
              key={toast.id}
              className={`toast-item pointer-events-auto w-full flex items-start gap-3 p-4 rounded-lg border shadow-lg glass-surface border-[var(--glass-border)] transition-all`}
            >
              {/* Type Icons */}
              <div className="shrink-0 mt-0.5">
                {isSuccess && <FiCheckCircle className="text-[var(--success)]" size={18} />}
                {isDanger && <FiAlertCircle className="text-[var(--danger)]" size={18} />}
                {isWarning && <FiAlertCircle className="text-[var(--warning)]" size={18} />}
                {!isSuccess && !isDanger && !isWarning && <FiInfo className="text-[var(--primary)]" size={18} />}
              </div>

              {/* Msg */}
              <div className="flex-1 text-xs font-semibold leading-relaxed text-[var(--text-primary)]">
                {toast.message}
              </div>

              {/* Dismiss Action */}
              <button 
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 text-[var(--text-muted)] hover:text-white transition-fast"
              >
                <FiX size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
