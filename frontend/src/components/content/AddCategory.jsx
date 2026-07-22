import React, { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import './AddCategory.css';

export default function AddCategory({ onBack, onActionTrigger }) {
  const [formData, setFormData] = useState({
    categoryName: '',
    image: null
  });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    notify(`Successfully created category "${formData.categoryName || 'New Category'}"!`);
    if (onBack) onBack();
  };

  return (
    <div className="add-category-page">
      {/* Header Bar */}
      <div className="add-category-header-row">
        <div className="add-category-title-group">
          <h1>Add New Category</h1>
          <p>Wednesday, July 22, 2026</p>
        </div>

        <button 
          className="btn-all-category-orange"
          onClick={onBack || (() => window.history.back())}
        >
          <ArrowLeft size={16} />
          <span>All Category</span>
        </button>
      </div>

      <p style={{ fontSize: 13.5, color: '#64748b', marginTop: -10 }}>
        All fields are optional - fill what you have
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Card: Category Information */}
        <div className="add-category-card">
          <div className="category-card-header">
            <User size={18} />
            <span>Banner Information</span>
          </div>

          <div className="category-grid-2col">
            <div className="category-form-group">
              <label>Category Name</label>
              <input 
                type="text" 
                className="category-input-text" 
                placeholder="Enter Title name"
                value={formData.categoryName}
                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              />
            </div>

            <div className="category-form-group">
              <label>Image</label>
              <input 
                type="file" 
                className="category-file-input-box" 
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="category-form-actions-footer">
          <button 
            type="button" 
            className="btn-category-cancel"
            onClick={onBack || (() => window.history.back())}
          >
            Cancel
          </button>
          <button type="submit" className="btn-category-submit-orange">
            Add Gym Owner
          </button>
        </div>
      </form>
    </div>
  );
}
