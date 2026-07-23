import React from 'react';
import { Trash2, X } from 'lucide-react';
import './ConfirmDeleteModal.css';

export default function ConfirmDeleteModal({ isOpen, title, itemName, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-backdrop" onClick={onCancel}>
      <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="delete-modal-close-btn" onClick={onCancel} title="Close">
          <X size={18} />
        </button>

        <div className="delete-modal-icon-ring">
          <div className="delete-modal-icon-circle">
            <Trash2 size={26} />
          </div>
        </div>

        <h3 className="delete-modal-title">{title || 'Delete Confirmation'}</h3>

        <p className="delete-modal-message">
          Are you sure you want to delete <strong className="delete-modal-item-name">"{itemName || 'this item'}"</strong>?
          <br />
          This action is permanent and cannot be undone.
        </p>

        <div className="delete-modal-actions">
          <button className="btn-delete-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="btn-delete-confirm" 
            onClick={() => {
              onConfirm();
              if (onCancel) onCancel();
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
