import React from 'react';
import Modal from '../Modal';
import Button from '../ui/Button';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-4 text-center">
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
          <FiAlertTriangle size={24} />
        </div>
        <p className="text-[var(--text-secondary)] mb-6 text-sm">
          {message}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="danger" className="flex-1">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
