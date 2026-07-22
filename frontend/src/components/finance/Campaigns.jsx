import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Users, 
  Plus, 
  Send, 
  Bell,
  X
} from 'lucide-react';
import './Campaigns.css';

const initialCampaigns = [
  {
    id: 1,
    title: 'Holiday message',
    subTag: '📢 Important Update',
    messagePreview: 'Dear [Name]...',
    type: 'Notification',
    target: 'All',
    recipients: 2,
    sentCount: 0,
    failedCount: 0,
    status: 'Pending',
    createdDate: '22 Jul 2026'
  },
  {
    id: 2,
    title: 'Vh',
    subTag: '📋 Batch Update',
    messagePreview: 'Dear [Name]...',
    type: 'Notification',
    target: 'Filter',
    recipients: 3,
    sentCount: 0,
    failedCount: 0,
    status: 'Pending',
    createdDate: '16 Jul 2026'
  },
  {
    id: 3,
    title: 'Mansoon offer',
    subTag: '📢 Important Update',
    messagePreview: 'Dear...',
    type: 'Notification',
    target: 'All',
    recipients: 3,
    sentCount: 0,
    failedCount: 0,
    status: 'Pending',
    createdDate: '16 Jul 2026'
  },
  {
    id: 4,
    title: 'Batch update',
    subTag: '📋 Batch Update',
    messagePreview: 'Dear [Name]...',
    type: 'Notification',
    target: 'Filter',
    recipients: 4,
    sentCount: 0,
    failedCount: 0,
    status: 'Pending',
    createdDate: '28 Dec 2025'
  },
  {
    id: 5,
    title: 'Testing',
    subTag: '💰 Payment Reminder',
    messagePreview: 'Dear [Name]...',
    type: 'Notification',
    target: 'Filter',
    recipients: 2,
    sentCount: 0,
    failedCount: 0,
    status: 'Pending',
    createdDate: '28 Dec 2025'
  },
  {
    id: 6,
    title: 'Expiring Soon - Expiring in 1-3 Days',
    subTag: '⚠️ Membership Expiring Soon 🙏 Dear...',
    messagePreview: '',
    type: 'Notification',
    target: 'Selected',
    recipients: 2,
    sentCount: 0,
    failedCount: 0,
    status: 'Pending',
    createdDate: '28 Dec 2025'
  },
  {
    id: 7,
    title: 'Expiring Soon - Expiring in 1-3 Days',
    subTag: '⚠️ Membership Expiring Soon 🙏 Dear...',
    messagePreview: '',
    type: 'Notification',
    target: 'Selected',
    recipients: 2,
    sentCount: 0,
    failedCount: 0,
    status: 'Pending',
    createdDate: '28 Dec 2025'
  }
];

export default function Campaigns({ onActionTrigger }) {
  const [campaignsList, setCampaignsList] = useState(initialCampaigns);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subTag: '📢 Important Update',
    message: '',
    type: 'Notification',
    target: 'All'
  });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const filteredCampaigns = useMemo(() => {
    return campaignsList.filter((c) => {
      const matchesType = typeFilter === 'All Types' || c.type === typeFilter;
      const matchesStatus = statusFilter === 'All Status' || c.status === statusFilter;
      return matchesType && matchesStatus;
    });
  }, [campaignsList, typeFilter, statusFilter]);

  const handleSendCampaign = (id, title) => {
    setCampaignsList((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: 'Completed', sentCount: c.recipients }
          : c
      )
    );
    notify(`Sent campaign "${title}" to gym owners!`);
  };

  const handleCreateCampaignSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const newCampaign = {
      id: Date.now(),
      title: formData.title,
      subTag: formData.subTag,
      messagePreview: formData.message ? `${formData.message.slice(0, 25)}...` : 'Dear [Name]...',
      type: formData.type,
      target: formData.target,
      recipients: formData.target === 'All' ? 15 : 5,
      sentCount: 0,
      failedCount: 0,
      status: 'Pending',
      createdDate: '22 Jul 2026'
    };

    setCampaignsList([newCampaign, ...campaignsList]);
    notify(`Created new campaign "${formData.title}"`);
    setIsNewModalOpen(false);
  };

  return (
    <div className="campaigns-page">
      {/* Header */}
      <div className="campaigns-header-row">
        <div className="campaigns-title-group">
          <h1>Campaigns</h1>
          <p>Send WhatsApp, Email or Notification campaigns to gym owners</p>
        </div>

        <button className="btn-new-campaign-orange" onClick={() => setIsNewModalOpen(true)}>
          <Plus size={16} />
          <span>New Campaign</span>
        </button>
      </div>

      {/* 5 Stat Cards Grid */}
      <div className="campaigns-stats-grid-5">
        <div className="campaign-stat-card">
          <div className="stat-icon-square blue">
            <FileText size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Total Campaigns</span>
            <span className="val">{campaignsList.length}</span>
          </div>
        </div>

        <div className="campaign-stat-card">
          <div className="stat-icon-square green">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Completed</span>
            <span className="val">{campaignsList.filter(c => c.status === 'Completed').length}</span>
          </div>
        </div>

        <div className="campaign-stat-card">
          <div className="stat-icon-square orange">
            <Clock size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Pending</span>
            <span className="val">{campaignsList.filter(c => c.status === 'Pending').length}</span>
          </div>
        </div>

        <div className="campaign-stat-card">
          <div className="stat-icon-square purple">
            <Mail size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Total Sent</span>
            <span className="val">0</span>
          </div>
        </div>

        <div className="campaign-stat-card">
          <div className="stat-icon-square orange">
            <Users size={20} />
          </div>
          <div className="stat-info-text">
            <span className="lbl">Reachable</span>
            <span className="val">1</span>
          </div>
        </div>
      </div>

      {/* Filter Bar Card */}
      <div className="campaigns-filter-card">
        <select 
          className="audit-select-field"
          style={{ width: 140 }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All Types">All Types</option>
          <option value="Notification">Notification</option>
          <option value="Email">Email</option>
          <option value="WhatsApp">WhatsApp</option>
        </select>

        <select 
          className="audit-select-field"
          style={{ width: 140 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All Status">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <button className="btn-filter-navy" onClick={() => notify(`Filtered ${filteredCampaigns.length} campaigns`)}>
          Filter
        </button>
      </div>

      {/* Table Card */}
      <div className="campaigns-table-card">
        <div className="campaigns-table-header">
          <h4>{filteredCampaigns.length} campaigns</h4>
        </div>

        <div className="table-responsive">
          <table className="campaigns-custom-table">
            <thead>
              <tr>
                <th>CAMPAIGN</th>
                <th>TYPE</th>
                <th>TARGET</th>
                <th>RECIPIENTS</th>
                <th>SENT / FAILED</th>
                <th>STATUS</th>
                <th>CREATED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((c) => (
                <tr key={c.id}>
                  {/* CAMPAIGN */}
                  <td>
                    <div className="campaign-info-cell">
                      <h5>{c.title}</h5>
                      <span className="campaign-sub-tag">{c.subTag}</span>
                      {c.messagePreview && (
                        <span className="campaign-msg-preview">{c.messagePreview}</span>
                      )}
                    </div>
                  </td>

                  {/* TYPE */}
                  <td>
                    <span className="notification-type-badge">
                      <Bell size={13} />
                      <span>{c.type}</span>
                    </span>
                  </td>

                  {/* TARGET */}
                  <td style={{ fontWeight: 600, color: '#475569' }}>
                    {c.target}
                  </td>

                  {/* RECIPIENTS */}
                  <td style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>
                    {c.recipients}
                  </td>

                  {/* SENT / FAILED */}
                  <td>
                    <div className="sent-failed-fraction">
                      <span className="green">{c.sentCount}</span> / <span className="red">{c.failedCount}</span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td>
                    {c.status === 'Completed' ? (
                      <span className="status-completed-pill">• Completed</span>
                    ) : (
                      <span className="status-pending-tag">Pending</span>
                    )}
                  </td>

                  {/* CREATED */}
                  <td style={{ fontSize: 12.5, color: '#64748b', fontWeight: 500 }}>
                    {c.createdDate}
                  </td>

                  {/* ACTION */}
                  <td>
                    {c.status === 'Pending' && (
                      <button 
                        className="btn-send-campaign-green"
                        onClick={() => handleSendCampaign(c.id, c.title)}
                      >
                        <Send size={13} />
                        <span>Send</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup: New Campaign */}
      {isNewModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsNewModalOpen(false)}>
          <div className="modal-container" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Create New Campaign</h3>
              <button className="modal-close-btn" onClick={() => setIsNewModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 24 }}>
                <div className="form-group">
                  <label>Campaign Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Monsoon Offer 2026" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Campaign Tag/Subhead</label>
                  <select 
                    value={formData.subTag}
                    onChange={(e) => setFormData({ ...formData, subTag: e.target.value })}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                  >
                    <option value="📢 Important Update">📢 Important Update</option>
                    <option value="📋 Batch Update">📋 Batch Update</option>
                    <option value="💰 Payment Reminder">💰 Payment Reminder</option>
                    <option value="⚠️ Membership Expiring Soon">⚠️ Membership Expiring Soon</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Channel Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                    >
                      <option value="Notification">Notification</option>
                      <option value="Email">Email</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Target Audience</label>
                    <select 
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                      style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                    >
                      <option value="All">All Gym Owners</option>
                      <option value="Filter">Filtered Audience</option>
                      <option value="Selected">Selected Gyms</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Message Content</label>
                  <textarea 
                    rows={3}
                    placeholder="Dear [Name], check out our special offer..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13.5 }}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsNewModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-orange" style={{ padding: '10px 24px', borderRadius: 10 }}>
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
