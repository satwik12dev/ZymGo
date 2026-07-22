import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import './EmailTemplates.css';

const initialTemplates = [
  {
    id: 1,
    title: 'Welcome to Zymgoo',
    slug: 'welcome',
    category: 'general',
    subject: 'Welcome to Zymgoo - {{gym_name}}',
    status: 'Active'
  },
  {
    id: 2,
    title: 'Test Welcome Email',
    slug: 'test_welcome',
    category: 'notification',
    subject: 'Welcome to Zymgoo - {{gym_name}}',
    status: 'Active'
  },
  {
    id: 3,
    title: 'New Subscription Confirmation',
    slug: 'subscription_new',
    category: 'subscription',
    subject: 'Subscription Activated - {{gym_name}}',
    status: 'Active'
  },
  {
    id: 4,
    title: 'Subscription Expired - {{gym_name}}',
    slug: 'subscription_expired',
    category: 'subscription',
    subject: 'Your Subscription Has Expired - {{gym_name}}',
    status: 'Active'
  },
  {
    id: 5,
    title: 'Subscription Expiring Soon - Renewal Reminder',
    slug: 'subscription_expiring',
    category: 'subscription',
    subject: 'Subscription Expiring Soon - {{gym_name}}',
    status: 'Active'
  }
];

export default function EmailTemplates({ onActionTrigger }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Template Form State
  const [newSlug, setNewSlug] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newVars, setNewVars] = useState('');
  const [newBody, setNewBody] = useState('');
  const [isTemplateActive, setIsTemplateActive] = useState(true);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject.trim()) {
      if (onActionTrigger) onActionTrigger('Please enter Template Name and Subject');
      return;
    }

    const finalSlug = newSlug.trim() ? newSlug.trim().toLowerCase().replace(/\s+/g, '_') : newTitle.trim().toLowerCase().replace(/\s+/g, '_');
    const newTmplObj = {
      id: Date.now(),
      title: newTitle,
      slug: finalSlug,
      category: newCategory || 'general',
      subject: newSubject,
      status: 'Active'
    };

    setTemplates([...templates, newTmplObj]);
    setShowCreateModal(false);
    setNewSlug('');
    setNewTitle('');
    setNewCategory('');
    setNewSubject('');
    setNewVars('');
    setNewBody('');

    if (onActionTrigger) onActionTrigger(`Email template "${newTmplObj.title}" created successfully!`);
  };

  return (
    <div className="email-templates-page">
      {/* Title Hero Header */}
      <div className="email-templates-hero">
        <div className="email-templates-hero-title">
          <h1>Email Templates</h1>
          <p>Manage email templates for automated notifications</p>
        </div>

        <button
          className="btn-create-template-green"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} />
          <span>Create New Template</span>
        </button>
      </div>

      {/* Templates Directory Table Box */}
      <div className="email-templates-card-box">
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table className="templates-custom-table">
            <thead>
              <tr>
                <th>TEMPLATE</th>
                <th>CATEGORY</th>
                <th>SUBJECT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tmpl) => (
                <tr key={tmpl.id}>
                  <td>
                    <div className="template-name-text">{tmpl.title}</div>
                    <div className="template-slug-box">{tmpl.slug}</div>
                  </td>
                  <td>
                    <span className="category-pill-tag">{tmpl.category}</span>
                  </td>
                  <td className="template-subject-text">{tmpl.subject}</td>
                  <td>
                    <span className="status-active-badge">
                      <Check size={12} strokeWidth={3} />
                      <span>{tmpl.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creating New Template */}
      {showCreateModal && (
        <div className="template-modal-overlay">
          <div className="template-modal-content">
            <div className="template-modal-header">
              <h3>Create New Email Template</h3>
              <button
                className="template-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Row 1: Template Key & Template Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="modal-form-group">
                  <label className="modal-form-label">Template Key *</label>
                  <input
                    type="text"
                    className="modal-form-input"
                    placeholder="e.g., welcome_email"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    required
                  />
                  <span className="modal-form-sublabel">Unique identifier (lowercase, underscores only)</span>
                </div>

                <div className="modal-form-group">
                  <label className="modal-form-label">Template Name *</label>
                  <input
                    type="text"
                    className="modal-form-input"
                    placeholder="e.g., Welcome Email"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="modal-form-group">
                <label className="modal-form-label">Category *</label>
                <select
                  className="modal-form-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="general">general</option>
                  <option value="notification">notification</option>
                  <option value="subscription">subscription</option>
                  <option value="billing">billing</option>
                  <option value="marketing">marketing</option>
                </select>
              </div>

              {/* Subject */}
              <div className="modal-form-group">
                <label className="modal-form-label">Subject *</label>
                <input
                  type="text"
                  className="modal-form-input"
                  placeholder="Email subject line"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  required
                />
                <span className="modal-form-sublabel">You can use variables like {'{{gym_name}}'}, {'{{owner_name}}'}, etc.</span>
              </div>

              {/* Variables (JSON Array) */}
              <div className="modal-form-group">
                <label className="modal-form-label">Variables (JSON Array)</label>
                <input
                  type="text"
                  className="modal-form-input"
                  placeholder='["gym_name","owner_name","subscription_plan"]'
                  value={newVars}
                  onChange={(e) => setNewVars(e.target.value)}
                />
                <span className="modal-form-sublabel">JSON array of variable names (optional)</span>
              </div>

              {/* Email Body (HTML) */}
              <div className="modal-form-group">
                <label className="modal-form-label">Email Body (HTML) *</label>
                <textarea
                  className="modal-form-textarea"
                  rows={4}
                  placeholder="<p>Hello {{name}},</p><p>Your content here...</p>"
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  required
                />
                <span className="modal-form-sublabel">HTML content with {'{{variable}}'} placeholders</span>
              </div>

              {/* Checkbox Template is Active */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: '#334155', cursor: 'pointer', marginTop: 4 }}>
                <input
                  type="checkbox"
                  checked={isTemplateActive}
                  onChange={(e) => setIsTemplateActive(e.target.checked)}
                  style={{ width: 17, height: 17, accentColor: '#10B981', borderRadius: 4, cursor: 'pointer' }}
                />
                <span>Template is Active</span>
              </label>

              {/* Actions Footer */}
              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  <Plus size={16} />
                  <span>Create Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
