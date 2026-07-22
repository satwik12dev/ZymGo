import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import './ConfirmDeleteModal.css';

export default function ConfirmDeleteModal({ isOpen, title, itemName, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-backdrop" onClick={onCancel}>
      <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-icon-circle">
          <AlertTriangle size={30} />
        </div>

        <h3>{title || 'Delete Confirmation'}</h3>

        <p>
          Are you sure you want to delete <strong>"{itemName || 'this item'}"</strong>?
          <br />
          This action cannot be undone.
        </p>

        <div className="delete-modal-actions">
          <button className="btn-delete-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="btn-delete-confirm" 
            onClick={() => {
              onConfirm();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
