import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import EditCategoryModal from './EditCategoryModal';
import './AllCategories.css';

const initialCategories = [
  {
    id: 1,
    categoryName: 'Fashion',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 2,
    categoryName: 'Gym Dress',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 3,
    categoryName: 'Running Shoes',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 4,
    categoryName: 'Dumbbells',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 5,
    categoryName: 'Protien',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=200&q=80'
  }
];

export default function AllCategories({ onActionTrigger, onNavigateToAdd }) {
  const [categoriesList, setCategoriesList] = useState(initialCategories);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [editModal, setEditModal] = useState({ isOpen: false, category: null });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleDeleteCategory = (id, name) => {
    setCategoriesList((prev) => prev.filter((c) => c.id !== id));
    notify(`Deleted category "${name}"`);
  };

  const handleSaveCategory = (updatedCategory) => {
    setCategoriesList((prev) => 
      prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
    );
    notify(`Updated category "${updatedCategory.categoryName}"!`);
    setEditModal({ isOpen: false, category: null });
  };

  return (
    <div className="all-categories-page">
      {/* Top Header */}
      <div className="all-categories-header-row">
        <div className="all-categories-title-group">
          <h1>All Type Banner Management</h1>
          <p>Manage your banner from advertisement</p>
        </div>

        <button 
          className="btn-add-category-orange"
          onClick={() => {
            if (onNavigateToAdd) onNavigateToAdd();
            notify('Navigated to Add Category');
          }}
        >
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="all-categories-table-card">
        <div className="table-responsive">
          <table className="categories-custom-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>CATEGORY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {categoriesList.map((c) => (
                <tr key={c.id}>
                  {/* IMAGE */}
                  <td>
                    <img 
                      src={c.imageUrl} 
                      alt={c.categoryName} 
                      className="category-circle-thumb" 
                    />
                  </td>

                  {/* CATEGORY */}
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>
                    {c.categoryName}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="category-actions-group">
                      <span className={c.status === 'Active' ? 'badge-active-green-pill' : 'badge-inactive-pill'} style={{
                        backgroundColor: c.status === 'Active' ? '#dcfce7' : '#fee2e2',
                        color: c.status === 'Active' ? '#16a34a' : '#ef4444',
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '4px 14px',
                        borderRadius: 9999
                      }}>
                        {c.status}
                      </span>

                      <button 
                        className="btn-category-icon-edit"
                        title="Edit Category"
                        onClick={() => setEditModal({ isOpen: true, category: c })}
                      >
                        <Edit size={15} />
                      </button>

                      <button 
                        className="btn-category-icon-delete"
                        title="Delete Category"
                        onClick={() => setDeleteModal({ isOpen: true, id: c.id, title: c.categoryName })}
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

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={editModal.isOpen}
        category={editModal.category}
        onClose={() => setEditModal({ isOpen: false, category: null })}
        onSave={handleSaveCategory}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Category"
        itemName={deleteModal.title}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={() => {
          handleDeleteCategory(deleteModal.id, deleteModal.title);
          setDeleteModal({ isOpen: false, id: null, title: '' });
        }}
      />
    </div>
  );
}

