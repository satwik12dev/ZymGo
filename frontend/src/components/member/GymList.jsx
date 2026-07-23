import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import {
  Building2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Star,
  CreditCard,
  Search,
  Filter,
  Plus,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  Globe,
  MapPin,
  Upload,
  MoreVertical,
  Minus
} from 'lucide-react';
import { stateCityMap } from './AddMember';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import './GymList.css';

// Initial Mock Gym Data matching exact screenshot layout
const initialGymsData = [
  {
    id: 1,
    name: 'Core fitness gym',
    type: 'Unisex',
    seoCode: '019778 SEO ()',
    city: 'Moradabad',
    state: 'Uttar Pradesh',
    ownerName: 'yuvraj',
    ownerPhone: '7505690374',
    rating: 'No reviews',
    subscription: 'No Plan',
    status: 'Active',
    verified: false,
    approval: 'pending',
    initials: 'CO',
    avatarBg: '#FFEDD5',
    avatarColor: '#EA580C'
  },
  {
    id: 2,
    name: 'Fitness club',
    type: 'Unisex',
    seoCode: '019777 SEO ()',
    city: '—',
    state: '—',
    ownerName: 'yuvraj',
    ownerPhone: '7505690374',
    rating: 'No reviews',
    subscription: 'No Plan',
    status: 'Active',
    verified: false,
    approval: 'pending',
    initials: 'FI',
    avatarBg: '#DBEAFE',
    avatarColor: '#2563EB'
  },
  {
    id: 3,
    name: 'A super power bodybuilding gym',
    type: 'Unisex',
    seoCode: '019772 SEO ()',
    city: 'Dumra',
    state: 'Bihar',
    ownerName: 'Raja ali',
    ownerPhone: '7352132557',
    rating: 'No reviews',
    subscription: 'No Plan',
    status: 'Active',
    verified: false,
    approval: 'pending',
    initials: 'A',
    avatarBg: '#DCFCE7',
    avatarColor: '#16A34A'
  },
  {
    id: 4,
    name: 'Yoga Centre Boraservice',
    type: 'Yoga studio',
    seoCode: '019770 SEO ()',
    city: 'Guwahati',
    state: 'Assam',
    ownerName: 'Yoga Centre Boraservice',
    ownerPhone: '8876057353',
    rating: 'No reviews',
    subscription: 'No Plan',
    status: 'Active',
    verified: false,
    approval: 'approved',
    initials: 'YO',
    avatarBg: '#F3E8FF',
    avatarColor: '#9333EA'
  },
  {
    id: 5,
    name: 'Guwahati Yoga Bliss',
    type: 'Yoga studio',
    seoCode: '019769 SEO ()',
    city: 'Guwahati',
    state: 'Assam',
    ownerName: 'Guwahati Yoga Bliss',
    ownerPhone: '6003232408',
    rating: 'No reviews',
    subscription: 'No Plan',
    status: 'Active',
    verified: false,
    approval: 'approved',
    initials: 'GU',
    avatarBg: '#FCE7F3',
  }
];

export default function GymList({
  onActionTrigger,
  onOpenAddGym,
  onOpenAnalytics,
  onSelectGym,
  onSelectMember,
  onNavigateToBulkUploadGym,
  onNavigateToEditGym
}) {
  const [gymsList, setGymsList] = useState(initialGymsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [approvedFilter, setApprovedFilter] = useState('All');
  const [selectedGyms, setSelectedGyms] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  useEffect(() => {
    async function loadGyms() {
      try {
        const res = await api.gym.getGymList();
        if (res.success && res.gyms && res.gyms.length > 0) {
          const mapped = res.gyms.map(g => ({
            id: g.id || g.gym_id,
            rawId: g.id,
            name: g.gym_name,
            type: g.gym_type || 'Unisex',
            seoCode: `${g.gym_id || g.id} SEO ()`,
            city: g.city || '—',
            state: g.state || '—',
            ownerName: g.owner_name || 'Owner',
            ownerPhone: g.mobile || '—',
            rating: 'No reviews',
            subscription: 'No Plan',
            status: g.status === '1' || g.status === 1 ? 'Active' : 'Inactive',
            verified: Boolean(g.is_verified),
            approval: g.admin_approval_status || 'pending',
            initials: (g.gym_name || 'G').substring(0, 2).toUpperCase(),
            avatarBg: '#FFEDD5',
            avatarColor: '#EA580C'
          }));
          setGymsList(mapped);
        }
      } catch (err) {
        console.warn('Using default gym list:', err.message);
      }
    }
    loadGyms();
  }, []);

  const handleDeleteGym = async (id, name, rawId) => {
    try {
      const targetId = rawId || id;
      await api.gym.deleteGym(targetId);
      setGymsList((prev) => prev.filter((g) => g.id !== id && g.rawId !== targetId));
      notify(`Deleted gym "${name}"`);
    } catch (err) {
      setGymsList((prev) => prev.filter((g) => g.id !== id));
      notify(`Deleted gym "${name}"`);
    }
  };

  const toggleSelectAll = () => {
    if (selectedGyms.length === gymsList.length) {
      setSelectedGyms([]);
    } else {
      setSelectedGyms(gymsList.map(g => g.id));
    }
  };

  const toggleSelectGym = (id) => {
    if (selectedGyms.includes(id)) {
      setSelectedGyms(selectedGyms.filter(i => i !== id));
    } else {
      setSelectedGyms([...selectedGyms, id]);
    }
  };

  const filteredGyms = useMemo(() => {
    return gymsList.filter((g) => {
      const matchesSearch =
        !searchQuery ||
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.ownerPhone.includes(searchQuery);

      const matchesState = stateFilter === 'All' || g.state === stateFilter;
      const matchesCity = cityFilter === 'All' || g.city === cityFilter;
      const matchesStatus = statusFilter === 'All' || g.status === statusFilter;

      return matchesSearch && matchesState && matchesCity && matchesStatus;
    });
  }, [gymsList, searchQuery, stateFilter, cityFilter, statusFilter]);

  const [viewingGym, setViewingGym] = useState(null);

  return (
    <div className="gym-management-page">
      {/* Top Header */}
      <div className="gym-header">
        <div className="gym-title-group">
          <h1>Gym Management</h1>
          <p>Manage all gyms with advanced filtering</p>
        </div>

        <div className="gym-header-actions">
          <button
            className="btn-analytics"
            onClick={() => onOpenAnalytics ? onOpenAnalytics() : notify('Redirecting to Gym Analytics...')}
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>
          <button
            className="btn-bulk-upload"
            onClick={() => onNavigateToBulkUploadGym ? onNavigateToBulkUploadGym() : notify('Redirecting to Bulk Upload Gym...')}
          >
            <Upload size={16} />
            <span>Bulk Upload</span>
          </button>
          <button
            className="btn-add-gym-orange"
            onClick={() => onOpenAddGym ? onOpenAddGym() : notify('Opening Add Gym Form...')}
          >
            <Plus size={16} />
            <span>Add Gym</span>
          </button>
        </div>
      </div>

      {/* 6 Metric Stat Cards */}
      <div className="gym-stats-grid">
        <div className="gym-stat-box">
          <div className="gym-stat-icon-wrapper blue">
            <Building2 size={20} />
          </div>
          <div className="gym-stat-info">
            <span className="gym-stat-val">17,857</span>
            <span className="gym-stat-lbl">Total</span>
          </div>
        </div>

        <div className="gym-stat-box">
          <div className="gym-stat-icon-wrapper green">
            <CheckCircle2 size={20} />
          </div>
          <div className="gym-stat-info">
            <span className="gym-stat-val">17,859</span>
            <span className="gym-stat-lbl">Active</span>
          </div>
        </div>

        <div className="gym-stat-box">
          <div className="gym-stat-icon-wrapper red">
            <XCircle size={20} />
          </div>
          <div className="gym-stat-info">
            <span className="gym-stat-val">0</span>
            <span className="gym-stat-lbl">Inactive</span>
          </div>
        </div>

        <div className="gym-stat-box">
          <div className="gym-stat-icon-wrapper blue">
            <ShieldCheck size={20} />
          </div>
          <div className="gym-stat-info">
            <span className="gym-stat-val">9,617</span>
            <span className="gym-stat-lbl">Verified</span>
          </div>
        </div>

        <div className="gym-stat-box">
          <div className="gym-stat-icon-wrapper purple">
            <Star size={20} />
          </div>
          <div className="gym-stat-info">
            <span className="gym-stat-val">0</span>
            <span className="gym-stat-lbl">Trusted</span>
          </div>
        </div>

        <div className="gym-stat-box">
          <div className="gym-stat-icon-wrapper teal">
            <CreditCard size={20} />
          </div>
          <div className="gym-stat-info">
            <span className="gym-stat-val">3</span>
            <span className="gym-stat-lbl">Subscribed</span>
          </div>
        </div>
      </div>

      {/* Advanced Filters Container */}
      <div className="gym-filters-card">
        <div className="filters-header-title">
          <Filter className="filters-icon-funnel" size={18} />
          <span>Advanced Filters</span>
        </div>

        {/* Filter Row 1 */}
        <div className="filters-grid-row">
          <div className="gym-search-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="gym-search-input"
              placeholder="Search gyms, owners"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="gym-filter-select"
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setCityFilter('All');
            }}
          >
            <option value="All">🌐 All States</option>
            {Object.keys(stateCityMap).sort().map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            className="gym-filter-select"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="All">🏙️ All Cities</option>
            {stateFilter !== 'All' && stateCityMap[stateFilter]
              ? stateCityMap[stateFilter].sort().map(ct => <option key={ct} value={ct}>{ct}</option>)
              : Array.from(new Set(Object.values(stateCityMap).flat())).sort().map(ct => <option key={ct} value={ct}>{ct}</option>)
            }
          </select>

          <select className="gym-filter-select" value={approvedFilter} onChange={(e) => setApprovedFilter(e.target.value)}>
            <option value="All">Approved: All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Filter Row 2 */}
        <div className="filters-grid-row">
          <select className="gym-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select className="gym-filter-select">
            <option value="All">Verified: All</option>
            <option value="Yes">Verified</option>
            <option value="No">Unverified</option>
          </select>

          <select className="gym-filter-select">
            <option value="All">Trusted: All</option>
            <option value="Yes">Trusted</option>
            <option value="No">Not Trusted</option>
          </select>

          <select className="gym-filter-select">
            <option value="All">Subscribed: All</option>
            <option value="Yes">Subscribed</option>
            <option value="No">Not Subscribed</option>
          </select>

          <select className="gym-filter-select">
            <option value="All">Plan: All</option>
            <option value="Basic">Basic Plan</option>
            <option value="Pro">Pro Plan</option>
          </select>

          <select className="gym-filter-select">
            <option value="All">Rating: All</option>
            <option value="4+">4.0 & above</option>
          </select>

          <select className="gym-filter-select">
            <option value="All">Media: All</option>
            <option value="HasPhotos">Has Photos</option>
          </select>
        </div>

        {/* Filter Row 3 Controls */}
        <div className="filters-grid-row" style={{ justifyContent: 'flex-start' }}>
          <select className="gym-filter-select">
            <option value="Newest">⬇ Newest First</option>
            <option value="Oldest">⬆ Oldest First</option>
          </select>

          <select className="gym-filter-select">
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>

          <button className="btn-apply-filters" onClick={() => notify(`Applied filters! Found ${filteredGyms.length} gyms.`)}>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Gym Directory Table Card */}
      <div className="gym-table-card">
        <div className="gym-table-header">
          <h4>17,835 gyms</h4>
          <span className="showing-counter-text">Showing 1–20</span>
        </div>

        <div className="table-responsive">
          <table className="gym-custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    className="checkbox-custom"
                    checked={selectedGyms.length === gymsList.length && gymsList.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>GYM</th>
                <th>LOCATION</th>
                <th>OWNER</th>
                <th>RATING</th>
                <th>SUBSCRIPTION</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredGyms.map((gym) => (
                <tr key={gym.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox-custom"
                      checked={selectedGyms.includes(gym.id)}
                      onChange={() => toggleSelectGym(gym.id)}
                    />
                  </td>

                  {/* GYM */}
                  <td>
                    <div className="gym-info-cell">
                      <div className="gym-avatar-circle" style={{ backgroundColor: gym.avatarBg, color: gym.avatarColor }}>
                        {gym.initials}
                      </div>
                      <div className="gym-details-column">
                        <span className="gym-title-name" style={{ cursor: 'pointer' }} onClick={() => onSelectGym ? onSelectGym(gym) : setViewingGym(gym)}>{gym.name}</span>
                        <span className="gym-subtitle-text">{gym.type}</span>
                        <span className="gym-seo-code">{gym.seoCode}</span>
                      </div>
                    </div>
                  </td>

                  {/* LOCATION */}
                  <td>
                    <div className="gym-details-column">
                      <span className="location-city">{gym.city}</span>
                      <span className="location-state">{gym.state}</span>
                    </div>
                  </td>

                  {/* OWNER */}
                  <td>
                    <div className="gym-details-column">
                      <span
                        className="owner-name"
                        style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 700 }}
                        onClick={() => onSelectMember ? onSelectMember(gym.ownerName) : notify(`Viewing owner ${gym.ownerName}`)}
                      >
                        {gym.ownerName}
                      </span>
                      <span className="owner-phone">{gym.ownerPhone}</span>
                    </div>
                  </td>

                  {/* RATING */}
                  <td>
                    <div className="rating-no-reviews">
                      <Star size={14} className="star-icon-muted" />
                      <span>{gym.rating}</span>
                    </div>
                  </td>

                  {/* SUBSCRIPTION */}
                  <td>
                    <span className="subscription-pill-grey">
                      <span className="pill-minus-symbol">➖</span> {gym.subscription}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <div className="status-pills-stack">
                      <span className="status-badge-pill active">
                        <span className="dot-green">●</span> ACTIVE
                      </span>

                      <span className="status-badge-pill unverified">
                        <span className="pill-minus-symbol">➖</span> Unverified
                      </span>

                      {gym.approval === 'pending' && (
                        <span className="status-badge-pill pending">
                          pending
                        </span>
                      )}
                      {gym.approval === 'approved' && (
                        <span className="status-badge-pill approved">
                          approved
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="action-buttons-group">
                      <button className="action-btn-icon view" title="View Gym" onClick={() => onSelectGym ? onSelectGym(gym) : setViewingGym(gym)}>
                        <Eye size={16} />
                      </button>
                      <button className="action-btn-icon edit" title="Edit Gym" onClick={() => onNavigateToEditGym ? onNavigateToEditGym(gym) : notify(`Editing ${gym.name}`)}>
                        <Edit size={16} />
                      </button>
                      <button className="action-btn-icon delete" title="Delete Gym" onClick={() => setDeleteModal({ isOpen: true, id: gym.id, title: gym.name })}>
                        <Trash2 size={16} />
                      </button>
                      <button className="action-btn-icon more" title="More Options" onClick={() => notify(`More options for ${gym.name}`)}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup: View Gym Details */}
      {viewingGym && (
        <div className="modal-backdrop" onClick={() => setViewingGym(null)}>
          <div className="modal-container" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Gym Overview & Details</h3>
              <button className="modal-close-btn" onClick={() => setViewingGym(null)}>
                <span style={{ fontSize: 18, fontWeight: 'bold' }}>×</span>
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Gym Header Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, backgroundColor: '#f8fafc', borderRadius: 14, border: '1px solid #f1f5f9' }}>
                <div
                  className="gym-avatar-circle"
                  style={{
                    backgroundColor: viewingGym.avatarBg,
                    color: viewingGym.avatarColor,
                    width: 60,
                    height: 60,
                    fontSize: 20,
                    fontWeight: 800
                  }}
                >
                  {viewingGym.initials}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{viewingGym.name}</h3>
                    <span className="status-pill active">• {viewingGym.status}</span>
                    {viewingGym.verified && <span className="status-pill verified">✓ Verified</span>}
                  </div>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{viewingGym.type} · Code: <code style={{ color: '#ea580c' }}>{viewingGym.seoCode}</code></span>
                </div>
              </div>

              {/* Gym Information Grid */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 10 }}>Gym Location & Rating</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>City / Location:</span> <div style={{ fontWeight: 600, color: '#0f172a' }}>{viewingGym.city}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>State:</span> <div style={{ fontWeight: 600, color: '#0f172a' }}>{viewingGym.state}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Rating:</span> <div style={{ fontWeight: 600, color: '#f59e0b' }}>★ {viewingGym.rating}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>SEO Status:</span> <div style={{ fontWeight: 600, color: '#2563eb' }}>SEO Done ✓</div></div>
                </div>
              </div>

              {/* Owner Information Grid */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 10 }}>Owner Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Owner Name:</span> <div style={{ fontWeight: 700, color: '#0f172a' }}>{viewingGym.ownerName}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Mobile Number:</span> <div style={{ fontWeight: 600, color: '#0f172a' }}>{viewingGym.ownerPhone}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Subscription Plan:</span> <div style={{ fontWeight: 600, color: '#16a34a' }}>{viewingGym.subscription}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Media Uploads:</span> <div style={{ fontWeight: 600, color: '#0f172a' }}>18 Photos Uploaded</div></div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setViewingGym(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Gym"
        itemName={deleteModal.title}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={() => {
          handleDeleteGym(deleteModal.id, deleteModal.title);
          setDeleteModal({ isOpen: false, id: null, title: '' });
        }}
      />
    </div>
  );
}
