import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  CheckCircle, 
  DollarSign, 
  FileText, 
  CreditCard, 
  Star, 
  MessageSquare, 
  Layout, 
  Phone, 
  MessageCircle, 
  ChevronRight, 
  MapPin,
  ExternalLink,
  ShieldCheck,
  Zap,
  Image as ImageIcon,
  Wallet
} from 'lucide-react';
import './GymDetail.css';

export default function GymDetail({ gymData, onBack, onActionTrigger, onEditGym, onCreateInvoice }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [trusted, setTrusted] = useState(false);
  const [topSearch, setTopSearch] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('Pending');

  const gym = gymData || {
    id: 1,
    name: 'Focus fitness',
    type: 'Unisex',
    seoCode: '019774',
    city: 'Moradabad',
    state: 'Uttar Pradesh',
    ownerName: 'yuvraj',
    ownerPhone: '7505690374',
    ownerEmail: 'singhyuvraj0374@gmail.com',
    ownerId: '0000013957',
    gymPhone: '9690162784',
    gymEmail: 'fitness@gmail.com',
    status: 'Active',
    verified: false,
    initials: 'FO'
  };

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  return (
    <div className="gym-detail-page">
      {/* Top Header & Breadcrumb */}
      <div className="gym-detail-top-nav">
        <div className="gym-detail-breadcrumb">
          <button className="btn-icon-back" onClick={onBack} title="Back to Gym Management">
            <ArrowLeft size={18} />
          </button>
          <div className="breadcrumb-text-group">
            <span className="breadcrumb-path">Gym Management › Profile</span>
            <h1 className="gym-detail-title-main">{gym.name}</h1>
          </div>
        </div>

        <div className="gym-detail-actions-top">
          <button className="btn-edit-white" onClick={() => onEditGym ? onEditGym(gym) : notify(`Editing ${gym.name}...`)}>
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button className="btn-new-invoice-orange" onClick={() => onCreateInvoice ? onCreateInvoice(gym) : notify(`Creating new invoice for ${gym.name}...`)}>
            <Plus size={16} />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Gym Hero Banner Card */}
      <div className="gym-hero-card">
        <div className="gym-hero-left">
          <div className="gym-hero-avatar">
            {gym.initials || 'FO'}
          </div>

          <div className="gym-hero-meta">
            <div className="gym-hero-pills">
              <h2>{gym.name}</h2>
              <span className="status-pill active">• {gym.status || 'Active'}</span>
              <span className="status-pill pending" style={{ backgroundColor: '#fef08a', color: '#ca8a04' }}>
                Pending
              </span>
            </div>
            <span className="gym-hero-sub">
              {gym.seoCode || '019774'} · , · {gym.type || 'Unisex'}
            </span>
          </div>
        </div>

        <div className="plan-unsubscribed-box">
          <h4>No Plan</h4>
          <p>Unsubscribed</p>
        </div>
      </div>

      {/* 6 Metric Cards Row */}
      <div className="gym-detail-stats-grid">
        <div className="detail-stat-box">
          <div className="detail-stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle size={18} />
          </div>
          <div className="detail-stat-info">
            <span className="detail-stat-lbl">Active Subs</span>
            <span className="detail-stat-val">0</span>
          </div>
        </div>

        <div className="detail-stat-box">
          <div className="detail-stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <DollarSign size={18} />
          </div>
          <div className="detail-stat-info">
            <span className="detail-stat-lbl">Revenue</span>
            <span className="detail-stat-val">₹0</span>
          </div>
        </div>

        <div className="detail-stat-box">
          <div className="detail-stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <FileText size={18} />
          </div>
          <div className="detail-stat-info">
            <span className="detail-stat-lbl">Invoices</span>
            <span className="detail-stat-val">0</span>
          </div>
        </div>

        <div className="detail-stat-box">
          <div className="detail-stat-icon" style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}>
            <CreditCard size={18} />
          </div>
          <div className="detail-stat-info">
            <span className="detail-stat-lbl">Paid</span>
            <span className="detail-stat-val">₹0</span>
          </div>
        </div>

        <div className="detail-stat-box">
          <div className="detail-stat-icon" style={{ backgroundColor: '#fefce8', color: '#ca8a04' }}>
            <Star size={18} />
          </div>
          <div className="detail-stat-info">
            <span className="detail-stat-lbl">Rating</span>
            <span className="detail-stat-val">No reviews</span>
          </div>
        </div>

        <div className="detail-stat-box">
          <div className="detail-stat-icon" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
            <MessageSquare size={18} />
          </div>
          <div className="detail-stat-info">
            <span className="detail-stat-lbl">Reviews</span>
            <span className="detail-stat-val">0</span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="gym-tabs-bar">
        {[
          { label: 'Overview', icon: Layout },
          { label: 'Subscription', icon: CreditCard },
          { label: 'Invoices', icon: FileText },
          { label: 'Payments', icon: Wallet },
          { label: 'Media', icon: ImageIcon },
          { label: 'Features', icon: Zap },
          { label: 'Reviews', icon: Star }
        ].map((t) => {
          const IconComp = t.icon;
          const isActive = activeTab === t.label;
          return (
            <button
              key={t.label}
              className={`gym-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(t.label)}
            >
              <IconComp size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="gym-detail-main-layout">
        {/* Left Column */}
        <div className="left-content-column">
          {/* Owner / Account Card */}
          <div className="detail-card-box">
            <div className="detail-card-header-row">
              <h3>Owner / Account</h3>
              <span className="link-full-profile" onClick={() => notify('Opening Full Owner Profile...')}>
                Full Profile →
              </span>
            </div>

            <div className="owner-banner-group">
              <div className="owner-info-left">
                <div className="owner-avatar-circle">
                  {(gym.ownerName || 'YU').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{gym.ownerName || 'yuvraj'}</h4>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{gym.ownerId || '0000013957'}</span>
                  <div style={{ marginTop: 2 }}>
                    <span className="status-pill active">• Active</span>
                  </div>
                </div>
              </div>

              <div className="owner-action-buttons">
                <button className="btn-contact-call" onClick={() => notify(`Calling ${gym.ownerName}...`)}>
                  <Phone size={14} />
                  <span>Call</span>
                </button>
                <button className="btn-contact-whatsapp" onClick={() => notify(`Messaging ${gym.ownerName} on WhatsApp...`)}>
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Owner Details Grid */}
            <div className="detail-key-val-grid">
              <div className="key-val-item">
                <span className="key-val-label">MOBILE</span>
                <span className="key-val-value" style={{ color: '#2563eb' }}>{gym.ownerPhone || '7505690374'}</span>
              </div>
              <div className="key-val-item">
                <span className="key-val-label">EMAIL</span>
                <span className="key-val-value" style={{ color: '#2563eb' }}>{gym.ownerEmail || 'singhyuvraj0374@gmail.com'}</span>
              </div>
              <div className="key-val-item">
                <span className="key-val-label">CITY</span>
                <span className="key-val-value">{gym.city || 'Moradabad'} , {gym.state || 'Uttar Pradesh'}</span>
              </div>
              <div className="key-val-item">
                <span className="key-val-label">JOINED</span>
                <span className="key-val-value">16 Jul 2026</span>
              </div>
            </div>

            {/* Other Gyms by this Owner */}
            <div className="other-gyms-group">
              <span className="key-val-label">OTHER GYMS BY THIS OWNER</span>
              <div className="other-gym-item" onClick={() => notify('Opening Fitness Gym...')}>
                <div className="other-gym-left">
                  <div className="gym-avatar-circle" style={{ backgroundColor: '#ffedd5', color: '#ea580c', width: 32, height: 32, fontSize: 11 }}>
                    FI
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>Fitness</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>Moradabad, Uttar Pradesh</div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: '#cbd5e1' }} />
              </div>

              <div className="other-gym-item" onClick={() => notify('Opening Fitness Point Gym...')}>
                <div className="other-gym-left">
                  <div className="gym-avatar-circle" style={{ backgroundColor: '#ffedd5', color: '#ea580c', width: 32, height: 32, fontSize: 11 }}>
                    FI
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>Fitness point</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>Moradabad, Uttar Pradesh</div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: '#cbd5e1' }} />
              </div>
            </div>
          </div>

          {/* Gym Details Table Card */}
          <div className="detail-card-box">
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Gym Details</h3>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'GYM ID', value: gym.seoCode || '019774' },
                { label: 'GYM TYPE', value: gym.type || 'Unisex' },
                { label: 'MOBILE', value: gym.gymPhone || '9690162784', isBlue: true },
                { label: 'EMAIL', value: gym.gymEmail || 'fitness@gmail.com', isBlue: true },
                { label: 'TIMING', value: 'N/A' },
                { label: 'ADMISSION', value: 'N/A' },
                { label: 'MEMBERS', value: '0 gym members in DB' },
                { label: 'ADDRESS', value: `${gym.city || 'Moradabad'}, ${gym.state || 'Uttar Pradesh'}` },
                { label: 'WEBSITE', value: 'N/A' },
                { label: 'CREATED', value: '22 Jul 2026' },
                { label: 'UPDATED', value: '22 Jul 2026 07:03' }
              ].map((item, idx) => (
                <div 
                  key={item.label}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '160px 1fr', 
                    padding: '12px 0',
                    borderBottom: idx === 10 ? 'none' : '1px solid #f8fafc' 
                  }}
                >
                  <span className="key-val-label">{item.label}</span>
                  <span className="key-val-value" style={{ color: item.isBlue ? '#2563eb' : '#0f172a' }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Card */}
          <div className="detail-card-box">
            <div className="detail-card-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={18} style={{ color: '#ea580c' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Location <span style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8' }}>28.838220, 78.695559</span></h3>
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="link-full-profile" style={{ textDecoration: 'none' }}>
                Open in Google Maps →
              </a>
            </div>

            <div className="map-view-container" style={{ position: 'relative', height: 220, borderRadius: 14, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <iframe
                title="Gym Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src="https://www.openstreetmap.org/export/embed.html?bbox=78.680000%2C28.825000%2C78.710000%2C28.850000&layer=mapnik&marker=28.838220%2C78.695559"
              ></iframe>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: -6 }}>
              <button className="btn-edit-white" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => window.open('https://maps.google.com')}>
                Google Maps
              </button>
              <button className="btn-edit-white" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => window.open('https://maps.apple.com')}>
                Apple Maps
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="right-sidebar-column">
          {/* Quick Actions Card */}
          <div className="detail-card-box">
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Quick Actions</h3>

            <div className="quick-action-btn-list">
              <button className="btn-qa-deactivate" onClick={() => notify(`Deactivated ${gym.name}`)}>
                Deactivate Gym
              </button>
              <button className="btn-qa-assign" onClick={() => notify(`Assigned plan to ${gym.name}`)}>
                Assign Plan
              </button>
              <button className="btn-qa-invoice" onClick={() => onCreateInvoice ? onCreateInvoice(gym) : notify(`Creating invoice for ${gym.name}`)}>
                Create Invoice
              </button>
              <button className="btn-qa-edit-white" onClick={() => onEditGym ? onEditGym(gym) : notify(`Editing details for ${gym.name}`)}>
                Edit Gym Details
              </button>
            </div>
          </div>

          {/* Admin Controls Card */}
          <div className="detail-card-box">
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Admin Controls</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label className="checkbox-admin-row">
                <input 
                  type="checkbox" 
                  checked={trusted} 
                  onChange={(e) => setTrusted(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#f97316' }} 
                />
                <span>Zymgoo Trusted</span>
              </label>

              <label className="checkbox-admin-row">
                <input 
                  type="checkbox" 
                  checked={topSearch} 
                  onChange={(e) => setTopSearch(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#f97316' }} 
                />
                <span>Top Search</span>
              </label>

              <div className="form-field-group" style={{ marginTop: 2 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Approval Status</label>
                <select 
                  className="gym-filter-select"
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-field-group">
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Approved Date</label>
                <input 
                  type="text" 
                  className="gym-search-input" 
                  placeholder="mm/dd/yyyy"
                  defaultValue="22 Jul 2026"
                  style={{ paddingLeft: 12, height: 38, borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="form-field-group">
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Block Date</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type="text" 
                    className="gym-search-input" 
                    placeholder="mm/dd/yyyy"
                    style={{ flex: 1, paddingLeft: 12, height: 38, borderRadius: 8, border: '1px solid #cbd5e1' }}
                  />
                  <button type="button" className="btn-today-red" style={{ height: 38, padding: '0 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                    Today
                  </button>
                </div>
              </div>

              <div className="form-field-group">
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Admin Remarks</label>
                <textarea 
                  rows={3} 
                  placeholder="Internal notes..."
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                ></textarea>
              </div>

              <button 
                type="button" 
                style={{ 
                  width: '100%', 
                  height: 42, 
                  backgroundColor: '#0f172a', 
                  color: '#ffffff', 
                  fontWeight: 700, 
                  fontSize: 14, 
                  borderRadius: 10, 
                  border: 'none', 
                  cursor: 'pointer',
                  marginTop: 6
                }}
                onClick={() => notify('Admin controls saved successfully!')}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
