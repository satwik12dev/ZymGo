import React, { useState, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';
import './EditCategoryModal.css';

export default function EditCategoryModal({ isOpen, category, onClose, onSave }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Active');
  const [previewImg, setPreviewImg] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.categoryName || category.subName || '');
      setStatus(category.status || 'Active');
      setPreviewImg(category.imageUrl || '');
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...category,
      categoryName: category.categoryName ? name : category.categoryName,
      subName: category.subName ? name : category.subName,
      status,
      imageUrl: previewImg
    });
  };

  return (
    <div className="edit-category-modal-backdrop" onClick={onClose}>
      <div className="edit-category-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="edit-category-modal-header">
          <h3>Edit {category.categoryName ? 'Category' : 'Sub Category'}</h3>
          <button className="btn-close-modal-x" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit}>
          <div className="edit-category-modal-body">
            <div className="modal-form-group">
              <label>{category.categoryName ? 'Category Name' : 'Sub Category Name'}</label>
              <input 
                type="text" 
                className="modal-input-field" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="modal-form-group">
              <label>Status</label>
              <select 
                className="modal-select-field"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label>Image Preview</label>
              <div className="modal-img-preview-box">
                <img src={previewImg || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80'} alt="Preview" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <input type="file" className="modal-file-upload-input" accept="image/*" />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Optional image replace</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="edit-category-modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-save-orange">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
