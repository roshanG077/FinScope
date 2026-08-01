import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';

export default function BudgetModal({ isOpen, onClose, onSubmit, editingBudget, categories }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    categoryId: ''
  });

  useEffect(() => {
    if (editingBudget) {
      setForm({
        name: editingBudget.name,
        amount: editingBudget.amount,
        month: editingBudget.month,
        year: editingBudget.year,
        categoryId: editingBudget.category?.id || ''
      });
    } else {
      setForm({
        name: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        categoryId: categories.find(c => c.type === 'EXPENSE')?.id || ''
      });
    }
  }, [editingBudget, isOpen, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('error', 'Please enter a valid budget label name.');
      return;
    }
    if (!form.amount || parseFloat(form.amount) <= 0) {
      showToast('error', 'Please enter a valid budget cap amount.');
      return;
    }
    if (!form.categoryId) {
      showToast('error', 'Please select a valid budget category.');
      return;
    }

    try {
      await onSubmit(form, editingBudget?.id);
      showToast('success', editingBudget ? 'Budget limit successfully modified!' : 'Budget ceiling successfully registered!');
      onClose();
    } catch (err) {
      showToast('error', 'Failed to save budget settings.');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingBudget ? 'Modify Budget Ceiling' : 'Define New Budget Limit'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Budget Label</label>
          <input 
            type="text" 
            required 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="input-ui"
            placeholder="Enter budget label"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Amount Limit (₹)</label>
            <input 
              type="number" 
              required 
              value={form.amount} 
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className="input-ui"
              placeholder="Enter limit amount"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Category</label>
            <select 
              value={form.categoryId} 
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
              required
              className="input-ui select-ui"
            >
              <option value="">Select Category</option>
              {categories
                .filter(c => c.type === 'EXPENSE')
                .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Month</label>
            <select 
              value={form.month} 
              onChange={e => setForm({ ...form, month: e.target.value })}
              className="input-ui select-ui"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Year</label>
            <input 
              type="number" 
              required 
              value={form.year} 
              onChange={e => setForm({ ...form, year: e.target.value })}
              className="input-ui"
              placeholder="Enter year"
            />
          </div>
        </div>

        {/* Form controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">Save Budget</Button>
        </div>
      </form>
    </Modal>
  );
}
