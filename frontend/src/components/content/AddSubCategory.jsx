import React, { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import './AddSubCategory.css';

export default function AddSubCategory({ onBack, onActionTrigger }) {
  const [formData, setFormData] = useState({
    parentCategory: '',
    subCategoryName: '',
    image: null
  });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    notify(`Successfully created sub-category "${formData.subCategoryName || 'New Sub Category'}"!`);
    if (onBack) onBack();
  };

  return (
    <div className="add-subcategory-page">
      {/* Header Bar */}
      <div className="add-subcategory-header-row">
        <div className="add-subcategory-title-group">
          <h1>Add New Sub Category</h1>
          <p>Wednesday, July 22, 2026</p>
        </div>

        <button 
          className="btn-all-subcategory-orange"
          onClick={onBack || (() => window.history.back())}
        >
          <ArrowLeft size={16} />
          <span>All Sub Category</span>
        </button>
      </div>

      <p style={{ fontSize: 13.5, color: '#64748b', marginTop: -10 }}>
        All fields are optional - fill what you have
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Card: Banner Information */}
        <div className="add-subcategory-card">
          <div className="subcategory-card-header">
            <User size={18} />
            <span>Banner Information</span>
          </div>

          <div className="subcategory-grid-3col">
            <div className="subcategory-form-group">
              <label>State <span className="req">*</span></label>
              <select 
                className="subcategory-select-dropdown"
                value={formData.parentCategory}
                onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="Fashion">Fashion</option>
                <option value="Gym Dress">Gym Dress</option>
                <option value="Running Shoes">Running Shoes</option>
                <option value="Dumbbells">Dumbbells</option>
                <option value="Protien">Protien</option>
              </select>
            </div>

            <div className="subcategory-form-group">
              <label>Sub Category Name</label>
              <input 
                type="text" 
                className="subcategory-input-text" 
                placeholder="Enter Title name"
                value={formData.subCategoryName}
                onChange={(e) => setFormData({ ...formData, subCategoryName: e.target.value })}
              />
            </div>

            <div className="subcategory-form-group">
              <label>Image</label>
              <input 
                type="file" 
                className="subcategory-file-input-box" 
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              />
            </div>
          </div>

          {/* Action Buttons inside Card Footer as per screenshot */}
          <div className="subcategory-card-actions-footer">
            <button 
              type="button" 
              className="btn-subcategory-cancel"
              onClick={onBack || (() => window.history.back())}
            >
              Cancel
            </button>
            <button type="submit" className="btn-subcategory-submit-orange">
              Add Gym Owner
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
