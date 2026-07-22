import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import EditCategoryModal from './EditCategoryModal';
import './AllSubCategories.css';

const initialSubCategories = [
  {
    id: 1,
    subName: 'Himachal Pradesh',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 2,
    subName: 'Supplyment 2',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 3,
    subName: 'Supplyment',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80'
  }
];

export default function AllSubCategories({ onActionTrigger, onNavigateToAdd }) {
  const [subCategoriesList, setSubCategoriesList] = useState(initialSubCategories);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [editModal, setEditModal] = useState({ isOpen: false, category: null });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleDeleteSubCategory = (id, name) => {
    setSubCategoriesList((prev) => prev.filter((sc) => sc.id !== id));
    notify(`Deleted sub-category "${name}"`);
  };

  const handleSaveSubCategory = (updatedSubCategory) => {
    setSubCategoriesList((prev) => 
      prev.map((sc) => (sc.id === updatedSubCategory.id ? updatedSubCategory : sc))
    );
    notify(`Updated sub-category "${updatedSubCategory.subName}"!`);
    setEditModal({ isOpen: false, category: null });
  };

  return (
    <div className="all-subcategories-page">
      {/* Top Header */}
      <div className="all-subcategories-header-row">
        <div className="all-subcategories-title-group">
          <h1>All Type Banner Management</h1>
          <p>Manage your banner from advertisement</p>
        </div>

        <button 
          className="btn-add-subcategory-orange"
          onClick={() => {
            if (onNavigateToAdd) onNavigateToAdd();
            notify('Navigated to Add Sub Category');
          }}
        >
          <Plus size={16} />
          <span>Add New Sub Category</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="all-subcategories-table-card">
        <div className="table-responsive">
          <table className="subcategories-custom-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>SUB NAME</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {subCategoriesList.map((sc) => (
                <tr key={sc.id}>
                  {/* IMAGE */}
                  <td>
                    <img 
                      src={sc.imageUrl} 
                      alt={sc.subName} 
                      className="subcategory-circle-thumb" 
                    />
                  </td>

                  {/* SUB NAME */}
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>
                    {sc.subName}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="subcategory-actions-group">
                      <span className={sc.status === 'Active' ? 'badge-active-green-pill' : 'badge-inactive-pill'} style={{
                        backgroundColor: sc.status === 'Active' ? '#dcfce7' : '#fee2e2',
                        color: sc.status === 'Active' ? '#16a34a' : '#ef4444',
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '4px 14px',
                        borderRadius: 9999
                      }}>
                        {sc.status}
                      </span>

                      <button 
                        className="btn-subcategory-icon-edit"
                        title="Edit Sub Category"
                        onClick={() => setEditModal({ isOpen: true, category: sc })}
                      >
                        <Edit size={15} />
                      </button>

                      <button 
                        className="btn-subcategory-icon-delete"
                        title="Delete Sub Category"
                        onClick={() => setDeleteModal({ isOpen: true, id: sc.id, title: sc.subName })}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Sub Category Modal */}
      <EditCategoryModal
        isOpen={editModal.isOpen}
        category={editModal.category}
        onClose={() => setEditModal({ isOpen: false, category: null })}
        onSave={handleSaveSubCategory}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Sub Category"
        itemName={deleteModal.title}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={() => {
          handleDeleteSubCategory(deleteModal.id, deleteModal.title);
          setDeleteModal({ isOpen: false, id: null, title: '' });
        }}
      />
    </div>
  );
}

