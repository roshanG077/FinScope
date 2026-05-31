import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { FiPlus, FiFilter, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

export default function Transactions({ 
  transactions, 
  categories, 
  openAddTx, 
  openEditTx, 
  handleDeleteTx 
}) {
  const { user } = useAuth();
  
  // Filter and search states
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatCurrency = (val) => {
    const cur = 'INR';
    return new Intl.NumberFormat(cur === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: cur
    }).format(val);
  };

  // Perform logical client side search & filter
  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.description?.toLowerCase().includes(search.toLowerCase()) || 
                            t.note?.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCat ? t.category?.id === parseInt(selectedCat) : true;
      const matchesType = selectedType ? t.type === selectedType : true;
      return matchesSearch && matchesCat && matchesType;
    })
    .sort((a, b) => {
      if (sortOrder === 'desc') return new Date(b.date) - new Date(a.date);
      return new Date(a.date) - new Date(b.date);
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 anim-slide">
      {/* Filters Toolbar */}
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-4xl">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-muted)] pointer-events-none">
              <FiSearch size={14} />
            </span>
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-ui !pl-9 !py-1.5"
            />
          </div>

          {/* Category Filter */}
          <select 
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="input-ui select-ui !py-1.5 max-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Type Filter */}
          <select 
            value={selectedType}
            onChange={e => { setSelectedType(e.target.value); setCurrentPage(1); }}
            className="input-ui select-ui !py-1.5 max-w-[140px]"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income Only</option>
            <option value="EXPENSE">Expense Only</option>
          </select>

          {/* Sort Filter */}
          <select 
            value={sortOrder}
            onChange={e => { setSortOrder(e.target.value); setCurrentPage(1); }}
            className="input-ui select-ui !py-1.5 max-w-[140px]"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Quick Add action */}
        <Button 
          onClick={openAddTx}
          variant="primary"
          className="flex-shrink-0"
        >
          <FiPlus size={16} />
          <span>New Record</span>
        </Button>
      </div>

      {/* Ledger Table */}
      <div className="table-wrapper shadow-md">
        <div className="overflow-x-auto">
          <table className="table-ui">
            <thead>
              <tr>
                <th>Details</th>
                <th>Category</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paginatedTransactions.map((tx, idx) => (
                <tr key={idx}>
                  {/* Title & note details */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8.5 h-8.5 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm shrink-0" 
                        style={{ backgroundColor: `${tx.category?.color || '#a0aec0'}15`, color: tx.category?.color || '#cbd5e0' }}
                      >
                        {tx.category?.name.charAt(0) || 'G'}
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="font-semibold text-[var(--text-primary)] truncate max-w-[220px]">{tx.description}</h5>
                        {tx.note && <p className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">{tx.note}</p>}
                        {tx.tags && <p className="text-[10px] text-[var(--primary)] truncate font-semibold mt-0.5">#{tx.tags.split(',').join(' #')}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Category bubble */}
                  <td>
                    <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(255,255,255,0.02)] border border-[var(--border)]">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tx.category?.color || '#cbd5e0' }}></span>
                      <span className="text-[var(--text-secondary)]">{tx.category?.name || 'General'}</span>
                    </span>
                  </td>

                  {/* Date format */}
                  <td className="text-xs text-[var(--text-secondary)] font-medium">
                    {new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    {tx.paymentMethod && <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{tx.paymentMethod}</div>}
                  </td>

                  {/* Amount formatting */}
                  <td className="text-right font-bold text-[15px]">
                    <Badge variant={tx.type === 'INCOME' ? 'success' : 'danger'}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </Badge>
                  </td>

                  {/* Action buttons */}
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => openEditTx(tx)} 
                        className="p-2 hover:bg-[var(--hover-bg)] rounded-md text-sky-400 hover:text-[var(--text-primary)] transition-fast"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTx(tx.id)} 
                        className="p-2 hover:bg-red-500/10 rounded-md text-[var(--danger)] hover:text-red-400 transition-fast"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-[var(--text-muted)]">
                    No transaction entries matched your active search query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} entries
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="!py-1 !px-2 !text-xs"
              >
                Previous
              </Button>
              <span className="text-xs font-semibold text-[var(--text-primary)] px-2">Page {currentPage} of {totalPages}</span>
              <Button 
                variant="secondary" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="!py-1 !px-2 !text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
