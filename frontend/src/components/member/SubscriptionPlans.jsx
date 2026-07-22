import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  DollarSign, 
  Plus, 
  Check, 
  Trash2, 
  BarChart2, 
  X,
  CreditCard
} from 'lucide-react';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import './SubscriptionPlans.css';

const initialPlans = [
  {
    id: 1,
    name: '1 Month Plan',
    code: '1MONTH',
    price: 0,
    durationDays: 30,
    badge: 'Try Now',
    badgeType: 'default',
    totalGyms: 13,
    activeGyms: 14,
    ownersCount: 13,
    expiredCount: 0,
    revenuePotential: 0,
    description: 'Trial subscription plan for newly registered gyms.',
    maxBranches: 1,
    maxMembers: 50,
    maxStaff: 2,
    displayOrder: 1,
    active: true,
    features: [
      'Basic gym management',
      'Up to 50 active members',
      'Standard support portal',
      'Single branch access'
    ]
  },
  {
    id: 2,
    name: 'Standard Pro Plan',
    code: 'PRO6M',
    price: 4999,
    durationDays: 180,
    badge: 'Popular',
    badgeType: 'popular',
    totalGyms: 28,
    activeGyms: 25,
    ownersCount: 20,
    expiredCount: 3,
    revenuePotential: 124975,
    description: 'Ideal package for growing fitness centers and medium clubs.',
    maxBranches: 3,
    maxMembers: 300,
    maxStaff: 10,
    displayOrder: 2,
    active: true,
    features: [
      'Multi-branch management (3)',
      'Up to 300 active members',
      'SMS & WhatsApp messaging',
      'Advance finance reports',
      'Priority email & phone support'
    ]
  },
  {
    id: 3,
    name: 'Enterprise VIP Plan',
    code: 'VIP1Y',
    price: 9999,
    durationDays: 365,
    badge: 'Best Value',
    badgeType: 'best',
    totalGyms: 42,
    activeGyms: 40,
    ownersCount: 35,
    expiredCount: 2,
    revenuePotential: 419958,
    description: 'Comprehensive suite for multi-location chain gyms.',
    maxBranches: 10,
    maxMembers: 2000,
    maxStaff: 50,
    displayOrder: 3,
    active: true,
    features: [
      'Unlimited branch management',
      'Unlimited member profiles',
      'Custom branding & white-label app',
      'Automated renewal billing',
      'Dedicated account manager 24/7'
    ]
  }
];

export default function SubscriptionPlans({ onNavigateToGyms, onActionTrigger }) {
  const [plans, setPlans] = useState(initialPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [viewingGymsPlan, setViewingGymsPlan] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    price: '',
    durationDays: '',
    maxBranches: 1,
    maxMembers: 100,
    maxStaff: 5,
    description: '',
    badge: '',
    displayOrder: 1,
    active: true
  });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      code: '',
      price: '',
      durationDays: 30,
      maxBranches: 1,
      maxMembers: 100,
      maxStaff: 5,
      description: '',
      badge: '',
      displayOrder: plans.length + 1,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      code: plan.code,
      price: plan.price,
      durationDays: plan.durationDays,
      maxBranches: plan.maxBranches || 1,
      maxMembers: plan.maxMembers || 100,
      maxStaff: plan.maxStaff || 5,
      description: plan.description,
      badge: plan.badge || '',
      displayOrder: plan.displayOrder || 1,
      active: plan.active !== undefined ? plan.active : true
    });
    setIsModalOpen(true);
  };

  const handleDeletePlan = (id, name) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    notify(`Deleted plan "${name}"`);
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const updatedFeatures = [
      `Up to ${formData.maxBranches} branches`,
      `${formData.maxMembers} members`,
      `${formData.maxStaff} staff members`
    ];

    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? { ...p, ...formData, features: updatedFeatures }
            : p
        )
      );
      notify(`Updated plan "${formData.name}"`);
    } else {
      const newPlan = {
        id: Date.now(),
        ...formData,
        badgeType: 'default',
        totalGyms: 0,
        activeGyms: 0,
        ownersCount: 0,
        expiredCount: 0,
        revenuePotential: 0,
        features: updatedFeatures,
        active: true
      };
      setPlans((prev) => [...prev, newPlan]);
      notify(`Created new subscription plan "${formData.name}"!`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="subscription-plans-page">
      {/* Top Header */}
      <div className="plans-header-row">
        <div className="plans-title-group">
          <h1>💳 Subscription Plans Management</h1>
          <p>Manage plans and track gym subscriptions across all packages</p>
        </div>

        <button className="btn-create-plan-orange" onClick={handleOpenCreateModal}>
          <Plus size={16} />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* 3 Top Metric Banner Cards */}
      <div className="plans-top-stats-grid">
        <div className="top-banner-card blue">
          <div className="banner-icon-circle">
            <Building2 size={24} />
          </div>
          <div className="banner-info-group">
            <span className="banner-big-val">15</span>
            <span className="banner-lbl-text">Total Subscribed Gyms</span>
          </div>
        </div>

        <div className="top-banner-card green">
          <div className="banner-icon-circle">
            <CheckCircle2 size={24} />
          </div>
          <div className="banner-info-group">
            <span className="banner-big-val">18</span>
            <span className="banner-lbl-text">Active Subscriptions</span>
          </div>
        </div>

        <div className="top-banner-card orange">
          <div className="banner-icon-circle">
            <DollarSign size={24} />
          </div>
          <div className="banner-info-group">
            <span className="banner-big-val">₹544,933</span>
            <span className="banner-lbl-text">Total Revenue Potential</span>
          </div>
        </div>
      </div>

      {/* Plans Card Grid */}
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card-item">
            {/* Hero Header */}
            <div className="plan-card-hero-header">
              <div>
                <div className="plan-title-code">
                  <h3>{plan.name}</h3>
                  <span className="plan-code-sub">{plan.code}</span>
                </div>
                <div className="plan-price-tag">
                  ₹{plan.price.toLocaleString()} <span className="duration">/ {plan.durationDays} days</span>
                </div>
              </div>

              {plan.badge && (
                <span className={`plan-badge-pill ${plan.badgeType === 'green' ? 'green' : ''}`}>
                  {plan.badge}
                </span>
              )}
            </div>

            {/* Body Content */}
            <div className="plan-card-body">
              {/* Analytics Box */}
              <div className="plan-analytics-box">
                <div className="analytics-box-title">
                  <BarChart2 size={15} style={{ color: '#ea580c' }} />
                  <span>Subscription Analytics</span>
                </div>

                <div className="analytics-grid-2x2">
                  <div className="mini-stat-cell">
                    <span className="mini-stat-num blue">{plan.totalGyms}</span>
                    <span className="mini-stat-lbl">Total Gyms</span>
                  </div>

                  <div className="mini-stat-cell">
                    <span className="mini-stat-num green">{plan.activeGyms}</span>
                    <span className="mini-stat-lbl">Active</span>
                  </div>

                  <div className="mini-stat-cell">
                    <span className="mini-stat-num purple">{plan.ownersCount}</span>
                    <span className="mini-stat-lbl">Owners</span>
                  </div>

                  <div className="mini-stat-cell">
                    <span className="mini-stat-num red">{plan.expiredCount}</span>
                    <span className="mini-stat-lbl">Expired</span>
                  </div>
                </div>

                <div className="revenue-potential-row">
                  <span>Revenue Potential:</span>
                  <span className="revenue-potential-val">₹{plan.revenuePotential.toLocaleString()}</span>
                </div>
              </div>

              {/* Description */}
              <p className="plan-desc-text">{plan.description}</p>

              {/* Features List */}
              <div className="plan-features-ul">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="feature-li-item">
                    <Check size={16} className="feature-check-icon" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Status Badge */}
              <div className="active-plan-badge">
                ✓ Active Plan
              </div>

              {/* Action Buttons Row */}
              <div className="plan-actions-footer">
                <button className="btn-plan-edit" onClick={() => handleOpenEditModal(plan)}>
                  Edit
                </button>
                <button 
                  className="btn-plan-view-gyms" 
                  onClick={() => setViewingGymsPlan(plan)}
                >
                  View Gyms
                </button>
                <button 
                  className="btn-plan-delete" 
                  title="Delete Plan"
                  onClick={() => setDeleteModal({ isOpen: true, id: plan.id, title: plan.name })}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup: Gyms with [Plan Name] */}
      {viewingGymsPlan && (
        <div className="modal-backdrop" onClick={() => setViewingGymsPlan(null)}>
          <div className="modal-container" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                Gyms with {viewingGymsPlan.name}
              </h3>
              <button className="modal-close-btn" onClick={() => setViewingGymsPlan(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '75vh', overflowY: 'auto' }}>
              {[
                {
                  name: 'Fitness point',
                  status: 'active',
                  price: '₹0.00',
                  owner: 'yuvraj',
                  id: '014415',
                  ownerId: '0000013957',
                  startDate: '2026-07-16',
                  expireDate: '2026-08-15',
                  payment: 'Free',
                  location: 'Moradabad, Uttar Pradesh'
                },
                {
                  name: 'MD Fitness Gym',
                  status: 'active',
                  price: '₹0.00',
                  owner: 'MD Fitness Gym',
                  id: '000174',
                  ownerId: '0000000086',
                  startDate: '2026-06-27',
                  expireDate: '2026-07-27',
                  payment: 'Free',
                  location: 'Moradabad, Uttar Pradesh'
                },
                {
                  name: 'N/A',
                  status: 'active',
                  price: '₹0.00',
                  owner: 'Faizan kha kk',
                  id: '010434',
                  ownerId: '0000010128',
                  startDate: '2026-06-25',
                  expireDate: '2026-07-25',
                  payment: 'Free',
                  location: 'N/A, N/A'
                },
                {
                  name: 'Testing Gym',
                  status: 'active',
                  price: '₹0.00',
                  owner: 'Testing',
                  id: '010433',
                  ownerId: '0000010127',
                  startDate: '2026-06-25',
                  expireDate: '2026-07-25',
                  payment: 'Free',
                  location: 'Moradabad, Uttar Pradesh'
                }
              ].map((gymItem, idx) => (
                <div key={idx} style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{gymItem.name}</h4>
                      <span className="status-pill active" style={{ fontSize: 11, padding: '2px 8px' }}>
                        {gymItem.status}
                      </span>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#ea580c' }}>{gymItem.price}</span>
                  </div>

                  <div style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
                    Owner: {gymItem.owner}
                  </div>

                  <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
                    ID: {gymItem.id} | Owner ID: {gymItem.ownerId}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12.5, color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: 10, marginTop: 2 }}>
                    <div><span style={{ color: '#94a3b8' }}>Start:</span> <strong>{gymItem.startDate}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Expires:</span> <strong>{gymItem.expireDate}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Payment:</span> <strong>{gymItem.payment}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Location:</span> <strong>{gymItem.location}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Popup: Edit / Create Plan */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                {editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create New Subscription Plan'}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePlan}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
                {/* Row 1: Plan Name & Plan Code */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label>Plan Name *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Plan Code *</label>
                    <input 
                      type="text" 
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Duration & Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label>Duration (days) *</label>
                    <input 
                      type="number" 
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Max Branches, Max Members, Max Staff */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label>Max Branches</label>
                    <input 
                      type="number" 
                      value={formData.maxBranches}
                      onChange={(e) => setFormData({ ...formData, maxBranches: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Max Members</label>
                    <input 
                      type="number" 
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Max Staff</label>
                    <input 
                      type="number" 
                      value={formData.maxStaff}
                      onChange={(e) => setFormData({ ...formData, maxStaff: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Row 4: Description */}
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                  />
                </div>

                {/* Row 5: Badge & Display Order */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label>Badge</label>
                    <select 
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                    >
                      <option value="">None</option>
                      <option value="Try Now">Try Now</option>
                      <option value="Most Popular">Most Popular</option>
                      <option value="Best Value">Best Value</option>
                      <option value="Max Savings">Max Savings</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Display Order</label>
                    <input 
                      type="number" 
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Row 6: Active Plan Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <input 
                    type="checkbox" 
                    id="activePlanCheck"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#ea580c', cursor: 'pointer' }}
                  />
                  <label htmlFor="activePlanCheck" style={{ fontSize: 14, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    Active Plan
                  </label>
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '16px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-orange" style={{ padding: '10px 24px', borderRadius: 10 }}>
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Subscription Plan"
        itemName={deleteModal.title}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={() => {
          handleDeletePlan(deleteModal.id, deleteModal.title);
          setDeleteModal({ isOpen: false, id: null, title: '' });
        }}
      />
    </div>
  );
}

