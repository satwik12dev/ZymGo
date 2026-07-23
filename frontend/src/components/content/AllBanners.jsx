import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { 
  Image as ImageIcon, 
  CheckCircle2, 
  Eye, 
  MousePointer, 
  Search, 
  Plus, 
  Calendar, 
  Edit, 
  Trash2, 
  X 
} from 'lucide-react';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import './AllBanners.css';

const initialBanners = [
  {
    id: 1,
    title: 'Advertise Banner',
    category: 'Ecommerce',
    categoryTheme: 'purple',
    location: 'Reasi , Uttar Pradesh',
    impressions: 0,
    clicks: 0,
    ctr: '0%',
    type: 'Phone',
    ctaText: 'Cta text hello',
    dateRange: '11 Dec – 31 Dec 2025',
    posBadge: '3',
    isActive: true,
    isExpired: true,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Product Banner',
    category: 'Ecommerce',
    categoryTheme: 'purple',
    location: 'Moradabad , Uttar Pradesh',
    impressions: 1,
    clicks: 1,
    ctr: '100%',
    type: 'Url',
    ctaText: 'dsfsvc',
    dateRange: '01 Dec – 24 Dec 2025',
    posBadge: '2',
    isActive: true,
    isExpired: true,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'sdfg',
    category: 'Findgym',
    categoryTheme: 'green',
    location: 'Reasi , Uttar Pradesh',
    impressions: 0,
    clicks: 0,
    ctr: '0%',
    type: 'Phone',
    ctaText: 'Cta text hello',
    dateRange: '11 Dec – 31 Dec 2025',
    posBadge: '3',
    isActive: true,
    isExpired: true,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Zymgoo Special Offer',
    category: 'Ecommerce',
    categoryTheme: 'purple',
    location: 'Gurugram , Haryana',
    impressions: 3,
    clicks: 2,
    ctr: '66%',
    type: 'Phone',
    ctaText: 'Call Now',
    dateRange: '05 Jan – 28 Feb 2026',
    posBadge: '2',
    isActive: true,
    isExpired: false,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    title: 'Fitness Fest 2026',
    category: 'Findgym',
    categoryTheme: 'green',
    location: 'Delhi NCR',
    impressions: 2,
    clicks: 1,
    ctr: '50%',
    type: 'Url',
    ctaText: 'https://zymgoo.com/fest',
    dateRange: '10 Jan – 15 Mar 2026',
    posBadge: '1',
    isActive: true,
    isExpired: false,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    title: 'Membership Discount',
    category: 'Findgym',
    categoryTheme: 'green',
    location: 'Kolkata , West Bengal',
    impressions: 0,
    clicks: 0,
    ctr: '0%',
    type: 'Url',
    ctaText: 'https://zymgoo.com/discount',
    dateRange: '01 Feb – 30 Apr 2026',
    posBadge: '1',
    isActive: true,
    isExpired: false,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    title: 'Summer Workout Pass',
    category: 'Ecommerce',
    categoryTheme: 'purple',
    location: 'Mumbai , Maharashtra',
    impressions: 0,
    clicks: 0,
    ctr: '0%',
    type: 'Phone',
    ctaText: 'Book Trial',
    dateRange: '15 Mar – 15 Jun 2026',
    posBadge: '2',
    isActive: true,
    isExpired: false,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    title: 'New Gym Opening Promo',
    category: 'Findgym',
    categoryTheme: 'green',
    location: 'Bengaluru , Karnataka',
    impressions: 0,
    clicks: 0,
    ctr: '0%',
    type: 'Url',
    ctaText: 'https://zymgoo.com/opening',
    dateRange: '01 May – 31 Jul 2026',
    posBadge: '3',
    isActive: true,
    isExpired: false,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  }
];

export default function AllBanners({ onActionTrigger, onNavigateToAdd, onNavigateToUpdate }) {
  const [bannersList, setBannersList] = useState(initialBanners);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [positionFilter, setPositionFilter] = useState('All Positions');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const filteredBanners = useMemo(() => {
    return bannersList.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'All Types' || b.category === typeFilter;
      const matchesPosition = positionFilter === 'All Positions' || b.posBadge === positionFilter;
      const matchesStatus = statusFilter === 'All Status' || (statusFilter === 'Active' && b.isActive);

      return matchesSearch && matchesType && matchesPosition && matchesStatus;
    });
  }, [bannersList, searchQuery, typeFilter, positionFilter, statusFilter]);

  useEffect(() => {
    async function loadBanners() {
      try {
        const res = await api.content.getBanners();
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map(b => ({
            id: b.id,
            title: b.title,
            category: 'Ecommerce',
            categoryTheme: 'purple',
            location: b.description || 'Global',
            impressions: 0,
            clicks: 0,
            ctr: '0%',
            type: 'Url',
            ctaText: b.redirect_url || 'View',
            dateRange: 'Active',
            posBadge: String(b.display_order || 1),
            isActive: Boolean(b.status),
            isExpired: false,
            imageUrl: b.image_url ? (b.image_url.startsWith('http') ? b.image_url : `http://localhost:3000/${b.image_url}`) : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
          }));
          setBannersList(mapped);
        }
      } catch (err) {
        console.warn('Using default banners:', err.message);
      }
    }
    loadBanners();
  }, []);

  const handleDeleteBanner = (id, title) => {
    setBannersList((prev) => prev.filter((b) => b.id !== id));
    notify(`Deleted banner "${title}"`);
  };

  return (
    <div className="all-banners-page">
      {/* Top Header Bar */}
      <div className="all-banners-header-row">
        <div className="all-banners-title-group">
          <h1>Banner Management</h1>
          <p>Manage advertisement banners across the app</p>
        </div>

        <button 
          className="btn-add-banner-orange"
          onClick={() => {
            if (onNavigateToAdd) onNavigateToAdd();
            notify('Navigated to Add Banner');
          }}
        >
          <Plus size={16} />
          <span>Add Banner</span>
        </button>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="all-banners-stats-grid-4">
        <div className="banner-stat-card">
          <div className="stat-icon-square blue">
            <ImageIcon size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Total Banners</span>
            <span className="val">{bannersList.length}</span>
          </div>
        </div>

        <div className="banner-stat-card">
          <div className="stat-icon-square green">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Active Banners</span>
            <span className="val">{bannersList.filter(b => b.isActive).length}</span>
          </div>
        </div>

        <div className="banner-stat-card">
          <div className="stat-icon-square purple">
            <Eye size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Impressions</span>
            <span className="val">{bannersList.reduce((acc, curr) => acc + curr.impressions, 0)}</span>
          </div>
        </div>

        <div className="banner-stat-card">
          <div className="stat-icon-square orange">
            <MousePointer size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Total Clicks</span>
            <span className="val">{bannersList.reduce((acc, curr) => acc + curr.clicks, 0)}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls Card */}
      <div className="all-banners-filter-card">
        <div className="banners-search-wrapper">
          <Search size={16} />
          <input 
            type="text" 
            className="banners-search-input" 
            placeholder="Search title, city, state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select 
          className="audit-select-field"
          style={{ width: 130 }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All Types">All Types</option>
          <option value="Ecommerce">Ecommerce</option>
          <option value="Findgym">Findgym</option>
        </select>

        <select 
          className="audit-select-field"
          style={{ width: 140 }}
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        >
          <option value="All Positions">All Positions</option>
          <option value="1">Position 1</option>
          <option value="2">Position 2</option>
          <option value="3">Position 3</option>
        </select>

        <select 
          className="audit-select-field"
          style={{ width: 130 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All Status">All Status</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>

        <button className="btn-banner-search-navy" onClick={() => notify(`Searched ${filteredBanners.length} banners`)}>
          Search
        </button>
      </div>

      {/* 3-Column Banner Cards Grid */}
      <div className="banners-cards-grid-3">
        {filteredBanners.map((b) => (
          <div key={b.id} className="banner-item-card">
            {/* Top Image Box */}
            <div className="banner-image-wrapper">
              <img src={b.imageUrl} alt={b.title} className="banner-img-element" />

              {b.isActive && <span className="badge-active-pill">• Active</span>}
              <span className="badge-pos-circle">{b.posBadge}</span>
              {b.isExpired && <span className="badge-expired-center">Expired</span>}
            </div>

            {/* Body Content */}
            <div className="banner-card-body">
              <div className="banner-title-row">
                <h4>{b.title}</h4>
                <span className={b.categoryTheme === 'purple' ? 'cat-pill-purple' : 'cat-pill-green'}>
                  {b.category}
                </span>
              </div>

              <div className="banner-location-text">{b.location}</div>

              {/* Metrics Grid */}
              <div className="banner-metrics-grid-2">
                <div className="metric-sub-box">
                  <span className="lbl">Impressions</span>
                  <span className="val">{b.impressions}</span>
                </div>

                <div className="metric-sub-box">
                  <span className="lbl">Clicks / CTR</span>
                  <span className="val">{b.clicks} ({b.ctr})</span>
                </div>
              </div>

              {/* Extra Details Line */}
              <div className="banner-extra-details">
                <div className="detail-line">
                  <span className="dot" />
                  <span>{b.type}</span>
                  <span style={{ color: '#94a3b8', fontWeight: 400 }}>{b.ctaText}</span>
                </div>

                <div className="date-range-line">
                  <Calendar size={13} />
                  <span>{b.dateRange}</span>
                </div>
              </div>
            </div>

            {/* Bottom Card Actions */}
            <div className="banner-card-actions">
              <button 
                className="action-text-btn"
                onClick={() => setPreviewImage(b.imageUrl)}
              >
                <Eye size={14} />
                <span>Preview</span>
              </button>

              <button 
                className="action-text-btn"
                onClick={() => {
                  if (onNavigateToUpdate) onNavigateToUpdate(b);
                  notify(`Editing banner "${b.title}"`);
                }}
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>

              <button 
                className="action-text-btn delete"
                onClick={() => setDeleteModal({ isOpen: true, id: b.id, title: b.title })}
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Popup Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Banner"
        itemName={deleteModal.title}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={() => {
          handleDeleteBanner(deleteModal.id, deleteModal.title);
          setDeleteModal({ isOpen: false, id: null, title: '' });
        }}
      />

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="modal-backdrop" onClick={() => setPreviewImage(null)}>
          <div 
            className="modal-container" 
            style={{ maxWidth: 650, backgroundColor: 'transparent', boxShadow: 'none' }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setPreviewImage(null)}
                style={{
                  position: 'absolute',
                  top: -16,
                  right: -16,
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 10
                }}
              >
                <X size={20} color="#0f172a" />
              </button>
              <img 
                src={previewImage} 
                alt="Banner Preview" 
                style={{ width: '100%', borderRadius: 16, border: '2px solid #ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
