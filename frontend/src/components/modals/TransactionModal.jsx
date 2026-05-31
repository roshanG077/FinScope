import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';

export default function TransactionModal({ isOpen, onClose, onSubmit, editingTx, categories }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    amount: '',
    type: 'EXPENSE',
    description: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    note: '',
    paymentMethod: 'UPI',
    tags: ''
  });

  useEffect(() => {
    if (editingTx) {
      setForm({
        amount: editingTx.amount,
        type: editingTx.type,
        description: editingTx.description,
        date: editingTx.date,
        categoryId: editingTx.category?.id || '',
        note: editingTx.note || '',
        paymentMethod: editingTx.paymentMethod || 'UPI',
        tags: editingTx.tags || ''
      });
    } else {
      setForm({
        amount: '',
        type: 'EXPENSE',
        description: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: categories.find(c => c.type === 'EXPENSE')?.id || '',
        note: '',
        paymentMethod: 'UPI',
        tags: ''
      });
    }
  }, [editingTx, isOpen, categories]);

  // Adjust category list dynamically when transaction type changes
  useEffect(() => {
    if (!editingTx) {
      const activeCats = categories.filter(c => c.type === form.type);
      if (activeCats.length > 0) {
        setForm(prev => ({ ...prev, categoryId: activeCats[0].id }));
      }
    }
  }, [form.type, categories, editingTx]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) {
      showToast('error', 'Please enter a valid amount greater than zero.');
      return;
    }
    if (!form.description.trim()) {
      showToast('error', 'Please enter a valid description.');
      return;
    }
    if (!form.categoryId) {
      showToast('error', 'Please select a transaction category.');
      return;
    }

    try {
      await onSubmit(form, editingTx?.id);
      showToast('success', editingTx ? 'Transaction record modified successfully!' : 'New transaction registered successfully!');
      onClose();
    } catch (err) {
      showToast('error', 'Failed to save transaction records.');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingTx ? 'Modify Transaction Details' : 'Record New Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Type</label>
            <select 
              value={form.type} 
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="input-ui select-ui"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Amount (₹)</label>
            <input 
              type="number" 
              step="0.01" 
              required 
              value={form.amount} 
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className="input-ui"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Description</label>
          <input 
            type="text" 
            required 
            value={form.description} 
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="input-ui"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                .filter(c => c.type === form.type)
                .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Date</label>
            <input 
              type="date" 
              required 
              value={form.date} 
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="input-ui"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Payment Method</label>
            <select 
              value={form.paymentMethod} 
              onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
              className="input-ui select-ui"
            >
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Tags (comma separated)</label>
            <input 
              type="text" 
              value={form.tags} 
              onChange={e => setForm({ ...form, tags: e.target.value })}
              className="input-ui"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Optional Notes</label>
          <textarea 
            value={form.note} 
            onChange={e => setForm({ ...form, note: e.target.value })}
            rows="2"
            className="input-ui resize-none"
          ></textarea>
        </div>

        {/* Form controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">Save Record</Button>
        </div>
      </form>
    </Modal>
  );
}
