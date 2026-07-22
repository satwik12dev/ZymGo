import React from 'react';
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
  AlertTriangle 
} from 'lucide-react';
import './MemberDetail.css';

export default function MemberDetail({ memberData, onBack, onActionTrigger, onOpenAddGym }) {
  const member = memberData || {
    id: 1,
    name: 'Raja ali',
    memberId: '0000019180',
    phone: '7352132557',
    email: 'rajaali7025@gmail.com',
    city: 'Dumra',
    state: 'Bihar',
    gyms: 1,
    status: 'Inactive',
    verified: false,
    initials: 'RA',
    registeredDate: '21 Jul 2026'
  };

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  return (
    <div className="member-detail-page">
      {/* Orange Hero Banner Card */}
      <div className="member-hero-banner">
        <div className="member-hero-left">
          <div className="member-hero-avatar-circle">
            {member.initials || 'RA'}
          </div>

          <div className="member-hero-info">
            <h1 className="member-hero-name">{member.name}</h1>
            <span className="member-hero-subtext">
              ID: #{member.memberId} · Member since {member.registeredDate || '21 Jul 2026'}
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

          <div className={`hero-badge-status ${member.status.toLowerCase() === 'active' ? 'active' : ''}`}>
            • {member.status}
          </div>

          <button className="btn-hero-edit" onClick={() => notify(`Editing member ${member.name}...`)}>
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
            <span className="stat-box-big-num">{member.gyms || 1}</span>
          </div>
          <div className="stat-box-icon-sq blue">
            <Building2 size={22} />
          </div>
        </div>

        <div className="member-stat-box-card">
          <div className="stat-box-left">
            <span className="stat-box-label-sub">ACTIVE GYMS</span>
            <span className="stat-box-big-num" style={{ color: '#10b981' }}>{member.gyms || 1}</span>
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
                <input type="text" className="contact-read-input" value={member.memberId} readOnly />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Mobile</span>
                <div className="contact-info-row">
                  <Phone size={15} />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Email</span>
                <div className="contact-info-row">
                  <Mail size={15} />
                  <span>{member.email}</span>
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
                  {member.city}, {member.state}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderTop: '1px solid #f8fafc', paddingTop: 12 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>City</span>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>{member.city}</div>
                </div>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Pincode</span>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>843302</div>
                </div>
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
                <p>Total {member.gyms || 1} gym registered</p>
              </div>

              <button 
                className="btn-add-new-gym-orange"
                onClick={() => onOpenAddGym ? onOpenAddGym() : notify('Opening Add Gym form...')}
              >
                <Plus size={16} />
                <span>Add New Gym</span>
              </button>
            </div>

            {/* Registered Gym Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="registered-gym-card-item">
                <div className="gym-item-top-row">
                  <div className="gym-item-left-group">
                    <div className="gym-item-num-badge">1</div>
                    <div>
                      <h4 className="gym-item-name-title">A super power bodybuilding gym</h4>
                      <span className="gym-item-type-sub">Unisex</span>
                    </div>
                  </div>

                  <div className="gym-item-right-pills">
                    <span className="pill-no-plan">No Plan</span>
                    <span className="pill-pending-yellow">pending</span>
                    <div className="action-buttons-group" style={{ marginLeft: 6 }}>
                      <button className="action-btn-icon view" title="View Gym" onClick={() => notify('Viewing A super power bodybuilding gym details...')}>
                        <Eye size={16} />
                      </button>
                      <button className="action-btn-icon edit" title="Edit Gym" onClick={() => notify('Editing Gym...')}>
                        <Edit size={16} />
                      </button>
                      <button className="action-btn-icon view" title="Add Details" onClick={() => notify('Adding Gym details...')}>
                        <Plus size={16} />
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
                    <span className="gym-detail-sub-value">{member.city}, {member.state}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>Sheohar chhawni bombay market near hotel aman vihar</span>
                  </div>

                  <div className="gym-detail-sub-item">
                    <span className="gym-detail-sub-label">
                      <Phone size={13} style={{ color: '#ea580c' }} /> Contact
                    </span>
                    <span className="gym-detail-sub-value">{member.phone}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{member.email}</span>
                  </div>

                  <div className="gym-detail-sub-item">
                    <span className="gym-detail-sub-label">
                      <Clock size={13} style={{ color: '#ea580c' }} /> Timing
                    </span>
                    <span className="gym-detail-sub-value" style={{ color: '#64748b' }}>N/A</span>
                  </div>

                  <div className="gym-detail-sub-item">
                    <span className="gym-detail-sub-label">
                      <DollarSign size={13} style={{ color: '#ea580c' }} /> Admission Fee
                    </span>
                    <span className="gym-detail-sub-value">₹0</span>
                  </div>

                  <div className="gym-detail-sub-item" style={{ gridColumn: 'span 2' }}>
                    <span className="gym-detail-sub-label">
                      <User size={13} style={{ color: '#ea580c' }} /> Onboarded By
                    </span>
                    <span className="gym-detail-sub-value" style={{ color: '#64748b' }}>Not assigned yet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
