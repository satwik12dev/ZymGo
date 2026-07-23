import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  ArrowLeft, 
  Plus, 
  Eye, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  Trash2
} from 'lucide-react';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import EditMemberModal from './EditMemberModal';
import './MemberDetail.css';

export default function MemberDetail({ memberData, onBack, onActionTrigger, onOpenAddGym, onViewGym, onEditGym, onDeleteGym }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, title: '' });
  const member = memberData || {
    id: 1,
    name: 'yuvraj',
    memberId: '0000013957',
    phone: '7505690374',
    email: 'singhyuvraj0374@gmail.com',
    address: 'Moradabad',
    city: 'Moradabad',
    state: 'Uttar Pradesh',
    pincode: '244001',
    gymsCount: 2,
    activeGyms: 2,
    status: 'Inactive',
    verified: false,
    initials: 'YU',
    registeredDate: '16 Jul 2026',
    gymsList: [
      {
        id: 1,
        name: 'Core fitness gym',
        type: 'Unisex',
        plan: 'No Plan',
        approval: 'pending',
        location: 'Moradabad, Uttar Pradesh',
        area: 'Moradabad',
        phone: '9690162784',
        email: 'fitness@gmail.com',
        timing: 'N/A',
        admissionFee: '₹0',
        onboardedBy: 'Not assigned yet'
      },
      {
        id: 2,
        name: 'Fitness club',
        type: 'Unisex',
        plan: 'No Plan',
        approval: 'pending',
        location: 'N/A, N/A',
        area: 'N/A',
        phone: '9690162784',
        email: 'fitness@gmail.com',
        timing: 'N/A',
        admissionFee: '₹0',
        onboardedBy: 'Not assigned yet'
      }
    ]
  };

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const defaultGyms = [
    {
      id: 1,
      name: 'Core fitness gym',
      type: 'Unisex',
      plan: 'No Plan',
      approval: 'pending',
      location: `${member.city || 'Moradabad'}, ${member.state || 'Uttar Pradesh'}`,
      area: member.city || 'Moradabad',
      phone: member.phone || '9690162784',
      email: member.email || 'fitness@gmail.com',
      timing: 'N/A',
      admissionFee: '₹0',
      onboardedBy: 'Not assigned yet'
    },
    {
      id: 2,
      name: 'Fitness club',
      type: 'Unisex',
      plan: 'No Plan',
      approval: 'pending',
      location: 'N/A, N/A',
      area: 'N/A',
      phone: member.phone || '9690162784',
      email: member.email || 'fitness@gmail.com',
      timing: 'N/A',
      admissionFee: '₹0',
      onboardedBy: 'Not assigned yet'
    }
  ];

  const gymsToDisplay = member.gymsList || defaultGyms;
  const countDisplay = member.gymsCount || member.gyms || gymsToDisplay.length;

  return (
    <div className="member-detail-page">
      {/* Orange Hero Banner Card */}
      <div className="member-hero-banner">
        <div className="member-hero-left">
          <div className="member-hero-avatar-circle">
            {member.initials || (member.name ? member.name.slice(0, 2).toUpperCase() : 'YU')}
          </div>

          <div className="member-hero-info">
            <h1 className="member-hero-name">{member.name}</h1>
            <span className="member-hero-subtext">
              ID: #{member.memberId || member.id || '0000013957'} · Member since {member.registeredDate || '16 Jul 2026'}
            </span>
          </div>
        </div>

        <div className="member-hero-actions-right">
          {!member.verified && (
            <div className="hero-badge-warning">
              <AlertTriangle size={14} />
              <span>Email Not Verified</span>
            </div>
          )}

          <div className={`hero-badge-status ${member.status?.toLowerCase() === 'active' ? 'active' : ''}`}>
            • {member.status || 'Inactive'}
          </div>

          <button className="btn-hero-edit" onClick={() => setIsEditModalOpen(true)}>
            <Edit size={16} />
            <span>Edit Member</span>
          </button>

          <button className="btn-hero-back" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards Row */}
      <div className="member-stats-grid-4">
        <div className="member-stat-box-card">
          <div className="stat-box-left">
            <span className="stat-box-label-sub">TOTAL GYMS</span>
            <span className="stat-box-big-num">{countDisplay}</span>
          </div>
          <div className="stat-box-icon-sq blue">
            <Building2 size={22} />
          </div>
        </div>

        <div className="member-stat-box-card">
          <div className="stat-box-left">
            <span className="stat-box-label-sub">ACTIVE GYMS</span>
            <span className="stat-box-big-num" style={{ color: '#10b981' }}>{member.activeGyms || countDisplay}</span>
          </div>
          <div className="stat-box-icon-sq green">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="member-stat-box-card">
          <div className="stat-box-left">
            <span className="stat-box-label-sub">VERIFIED</span>
            <span className="stat-box-big-num" style={{ color: '#9333ea' }}>0</span>
          </div>
          <div className="stat-box-icon-sq purple">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="member-stat-box-card">
          <div className="stat-box-left">
            <span className="stat-box-label-sub">TRUSTED</span>
            <span className="stat-box-big-num" style={{ color: '#f97316' }}>0</span>
          </div>
          <div className="stat-box-icon-sq orange">
            <Star size={22} />
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="member-detail-main-layout">
        {/* Left Column */}
        <div className="left-member-column">
          {/* Contact Information Card */}
          <div className="member-card-box">
            <div className="member-card-title-icon">
              <User className="icon-orange-head" size={18} />
              <span>Contact Information</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Owner ID</span>
                <input type="text" className="contact-read-input" value={member.memberId || member.id || '0000013957'} readOnly />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Mobile</span>
                <div className="contact-info-row">
                  <Phone size={15} />
                  <span>{member.phone || '7505690374'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Email</span>
                <div className="contact-info-row">
                  <Mail size={15} />
                  <span>{member.email || 'singhyuvraj0374@gmail.com'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="member-card-box">
            <div className="member-card-title-icon">
              <MapPin className="icon-orange-head" size={18} />
              <span>Location</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Address</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {member.address || member.city || 'Moradabad'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderTop: '1px solid #f8fafc', paddingTop: 12 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>City</span>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>{member.city || 'Moradabad'}</div>
                </div>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Pincode</span>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>{member.pincode || '244001'}</div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>State</span>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{member.state || 'Uttar Pradesh'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-member-column">
          {/* Registered Gyms Card */}
          <div className="member-card-box">
            <div className="reg-gyms-header-row">
              <div className="reg-gyms-title-group">
                <h3>Registered Gyms</h3>
                <p>Total {countDisplay} gyms registered</p>
              </div>

              <button 
                className="btn-add-new-gym-orange"
                onClick={() => onOpenAddGym ? onOpenAddGym(member) : notify('Opening Add Gym form...')}
              >
                <Plus size={16} />
                <span>Add New Gym</span>
              </button>
            </div>

            {/* Registered Gym Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {gymsToDisplay.map((gymItem, idx) => (
                <div key={gymItem.id || idx} className="registered-gym-card-item">
                  <div className="gym-item-top-row">
                    <div className="gym-item-left-group">
                      <div className="gym-item-num-badge">{idx + 1}</div>
                      <div>
                        <h4 className="gym-item-name-title">{gymItem.name}</h4>
                        <span className="gym-item-type-sub">{gymItem.type || 'Unisex'}</span>
                      </div>
                    </div>

                    <div className="gym-item-right-pills">
                      <span className="pill-no-plan">{gymItem.plan || 'No Plan'}</span>
                      <span className="pill-pending-yellow">{gymItem.approval || 'pending'}</span>
                      <div className="action-buttons-group" style={{ marginLeft: 6 }}>
                        <button className="action-btn-icon view" title="View Gym" onClick={() => onViewGym ? onViewGym(gymItem) : notify(`Viewing ${gymItem.name} details...`)}>
                          <Eye size={16} />
                        </button>
                        <button className="action-btn-icon edit" title="Edit Gym" onClick={() => onEditGym ? onEditGym(gymItem) : notify(`Editing ${gymItem.name}...`)}>
                          <Edit size={16} />
                        </button>
                        <button className="action-btn-icon delete" title="Delete Gym" onClick={() => setDeleteModal({ isOpen: true, title: gymItem.name })}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid inside Gym Item Card */}
                  <div className="gym-details-grid-4col">
                    <div className="gym-detail-sub-item">
                      <span className="gym-detail-sub-label">
                        <MapPin size={13} style={{ color: '#ea580c' }} /> Location
                      </span>
                      <span className="gym-detail-sub-value">{gymItem.location || `${member.city}, ${member.state}`}</span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{gymItem.area || member.city || 'Moradabad'}</span>
                    </div>

                    <div className="gym-detail-sub-item">
                      <span className="gym-detail-sub-label">
                        <Phone size={13} style={{ color: '#ea580c' }} /> Contact
                      </span>
                      <span className="gym-detail-sub-value">{gymItem.phone || member.phone || '9690162784'}</span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{gymItem.email || member.email || 'fitness@gmail.com'}</span>
                    </div>

                    <div className="gym-detail-sub-item">
                      <span className="gym-detail-sub-label">
                        <Clock size={13} style={{ color: '#ea580c' }} /> Timing
                      </span>
                      <span className="gym-detail-sub-value" style={{ color: '#64748b' }}>{gymItem.timing || 'N/A'}</span>
                    </div>

                    <div className="gym-detail-sub-item">
                      <span className="gym-detail-sub-label">
                        <DollarSign size={13} style={{ color: '#ea580c' }} /> Admission Fee
                      </span>
                      <span className="gym-detail-sub-value">{gymItem.admissionFee || '₹0'}</span>
                    </div>

                    <div className="gym-detail-sub-item" style={{ gridColumn: 'span 2' }}>
                      <span className="gym-detail-sub-label">
                        <User size={13} style={{ color: '#ea580c' }} /> Onboarded By
                      </span>
                      <span className="gym-detail-sub-value" style={{ color: '#64748b' }}>{gymItem.onboardedBy || 'Not assigned yet'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Gym"
        itemName={deleteModal.title}
        onCancel={() => setDeleteModal({ isOpen: false, title: '' })}
        onConfirm={() => {
          notify(`Deleted gym "${deleteModal.title}"`);
          setDeleteModal({ isOpen: false, title: '' });
        }}
      />

      {/* Edit Member Popup Modal */}
      <EditMemberModal
        isOpen={isEditModalOpen}
        member={member}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => notify(`Member "${data.name}" updated successfully!`)}
      />
    </div>
  );
}
