import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './EditMemberModal.css';

export default function EditMemberModal({ isOpen, member, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    city: '',
    pincode: '',
    address: ''
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || 'yuvraj',
        phone: member.phone || member.mobile || '7505690374',
        email: member.email || 'singhyuvraj0374@gmail.com',
        state: member.state || 'Uttar Pradesh',
        city: member.city || 'Moradabad',
        pincode: member.pincode || '244001',
        address: member.address || member.city || 'Moradabad'
      });
    }
  }, [member]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="edit-member-modal-backdrop" onClick={onClose}>
      <div className="edit-member-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="edit-member-modal-header">
          <h3>Edit Member</h3>
          <button className="edit-member-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-member-modal-body">
          <div className="edit-member-grid-2col">
            <div className="edit-member-field">
              <label>Owner Name</label>
              <input
                type="text"
                className="edit-member-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="edit-member-field">
              <label>Mobile</label>
              <input
                type="text"
                className="edit-member-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="edit-member-field">
              <label>Email</label>
              <input
                type="email"
                className="edit-member-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="edit-member-field">
              <label>State</label>
              <input
                type="text"
                className="edit-member-input"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="edit-member-field">
              <label>City</label>
              <input
                type="text"
                className="edit-member-input"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="edit-member-field">
              <label>Pincode</label>
              <input
                type="text"
                className="edit-member-input"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>

            <div className="edit-member-field full-width">
              <label>Address</label>
              <textarea
                className="edit-member-textarea"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="edit-member-modal-footer">
            <button type="button" className="btn-edit-member-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-edit-member-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
