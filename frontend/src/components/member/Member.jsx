import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Ban,
  Mail,
  Building2,
  Search,
  Plus,
  Upload,
  FileSpreadsheet,
  Eye,
  Edit,
  Trash2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import EditMemberModal from './EditMemberModal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { stateCityMap } from './AddMember';
import './Member.css';
const initialMembersData = [
  {
    id: 1,
    name: 'Raja ali',
    memberId: '0000019180',
    phone: '7352132557',
    email: 'rajaali7025@gmail.com',
    city: 'Dumra',
    state: 'Bihar',
    gyms: 1,
    status: 'Active',
    verified: false,
    initials: 'RA',
    avatarBg: '#ffedd5',
    avatarColor: '#ea580c'
  },
  {
    id: 2,
    name: 'Yog Chetna',
    memberId: '0000019179',
    phone: '9508251830',
    email: 'yogchetna@gmail.com',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    gyms: 1,
    status: 'Active',
    verified: true,
    initials: 'YO',
    avatarBg: '#dbeafe',
    avatarColor: '#2563eb'
  },
  {
    id: 3,
    name: 'Nourish And Wellness Nutrition Center',
    memberId: '0000019178',
    phone: '9031336180',
    email: 'nourishwellness@gmail.com',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    gyms: 1,
    status: 'Active',
    verified: true,
    initials: 'NO',
    avatarBg: '#dcfce7',
    avatarColor: '#16a34a'
  },
  {
    id: 4,
    name: 'Inspirational Yoga',
    memberId: '0000019177',
    phone: '7209339704',
    email: 'inspirationalyoga@gmail.com',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    gyms: 1,
    status: 'Active',
    verified: true,
    initials: 'IN',
    avatarBg: '#f3e8ff',
    avatarColor: '#9333ea'
  },
  {
    id: 5,
    name: 'Shree Vyas Yoga Classes',
    memberId: '0000019176',
    phone: '7667953047',
    email: 'shreevyasyoga@gmail.com',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    gyms: 1,
    status: 'Active',
    verified: true,
    initials: 'SH',
    avatarBg: '#fce7f3',
    avatarColor: '#db2777'
  },
  {
    id: 6,
    name: 'Worldmakers fitness institute',
    memberId: '0000019175',
    phone: '9431529393',
    email: 'worldmakersfitness@gmail.com',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    gyms: 1,
    status: 'Active',
    verified: true,
    initials: 'WO',
    avatarBg: '#e0f2fe',
    avatarColor: '#0284c7'
  },
  {
    id: 7,
    name: 'Narayana Zumba & Fitness',
    memberId: '0000019174',
    phone: '9835123456',
    email: 'narayanazumba@gmail.com',
    city: 'Ranchi',
    state: 'Jharkhand',
    gyms: 2,
    status: 'Active',
    verified: true,
    initials: 'NA',
    avatarBg: '#ffedd5',
    avatarColor: '#ea580c'
  },
  {
    id: 8,
    name: 'Muscle Kraft Gym',
    memberId: '0000019173',
    phone: '9931876543',
    email: 'musclekraft@gmail.com',
    city: 'Patna',
    state: 'Bihar',
    gyms: 1,
    status: 'Inactive',
    verified: false,
    initials: 'MK',
    avatarBg: '#ccfbf1',
    avatarColor: '#0d9488'
  },
  {
    id: 9,
    name: 'FitGuru Fitness Club',
    memberId: '0000019172',
    phone: '9123456789',
    email: 'fitguru@gmail.com',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    gyms: 3,
    status: 'Active',
    verified: true,
    initials: 'FG',
    avatarBg: '#ffedd5',
    avatarColor: '#d97706'
  },
  {
    id: 10,
    name: 'Om Fitness Studio',
    memberId: '0000019171',
    phone: '9876543210',
    email: 'omfitness@gmail.com',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    gyms: 1,
    status: 'Active',
    verified: false,
    initials: 'OM',
    avatarBg: '#f3e8ff',
    avatarColor: '#7c3aed'
  }
];

// State-wise distribution chart data
const stateDistributionData = [
  { state: 'Uttar Pradesh', count: 3900, color: '#f97316' },
  { state: 'Maharashtra', count: 2600, color: '#3b82f6' },
  { state: 'Delhi', count: 1800, color: '#10b981' },
  { state: 'Haryana', count: 1000, color: '#8b5cf6' },
  { state: 'Karnataka', count: 950, color: '#ec4899' },
  { state: 'Rajasthan', count: 950, color: '#f59e0b' },
  { state: 'Punjab', count: 900, color: '#0284c7' },
  { state: 'West Bengal', count: 900, color: '#2563eb' },
  { state: 'Telangana', count: 850, color: '#ef4444' },
  { state: 'Madhya Pradesh', count: 800, color: '#84cc16' }
];

// Top Cities donut chart data
const topCitiesData = [
  { city: 'New Delhi', value: 22, color: '#f97316' },
  { city: 'Bengaluru', value: 18, color: '#3b82f6' },
  { city: 'Hyderabad', value: 14, color: '#10b981' },
  { city: 'Ghaziabad', value: 11, color: '#8b5cf6' },
  { city: 'Delhi', value: 9, color: '#14b8a6' },
  { city: 'Kanpur', value: 7, color: '#06b6d4' },
  { city: 'Mumbai', value: 6, color: '#d946ef' },
  { city: 'Noida', value: 5, color: '#f59e0b' },
  { city: 'Pune', value: 4, color: '#eab308' },
  { city: 'Gurugram', value: 3, color: '#6366f1' },
  { city: 'Kolkata', value: 2, color: '#0284c7' },
  { city: 'Nagpur', value: 2, color: '#84cc16' }
];

export default function Member({
  activeNav,
  onActionTrigger,
  onSelectMember,
  onNavigateToAddMember,
  onNavigateToBulkUpload
}) {
  const [membersList, setMembersList] = useState(initialMembersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [emailFilter, setEmailFilter] = useState('All');
  const [pageSize, setPageSize] = useState('20');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [viewingMember, setViewingMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });

  React.useEffect(() => {
    if (activeNav === '/members/add') {
      setIsAddModalOpen(true);
    } else if (activeNav === '/members/bulk-upload') {
      setIsBulkModalOpen(true);
    }
  }, [activeNav]);

  // New member form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    gyms: 1,
    status: 'Active',
    verified: true
  });

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  // Filtered members calculation
  const filteredMembers = useMemo(() => {
    return membersList.filter((m) => {
      // Search query filter
      const matchesSearch =
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.memberId.includes(searchQuery) ||
        m.phone.includes(searchQuery) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase());

      // State filter
      const matchesState = stateFilter === 'All' || m.state === stateFilter;
      // City filter
      const matchesCity = cityFilter === 'All' || m.city === cityFilter;
      // Status filter
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      // Email filter (Verified vs Unverified vs All)
      const matchesEmail =
        emailFilter === 'All' ||
        (emailFilter === 'Verified' && m.verified) ||
        (emailFilter === 'Unverified' && !m.verified);

      return matchesSearch && matchesState && matchesCity && matchesStatus && matchesEmail;
    });
  }, [membersList, searchQuery, stateFilter, cityFilter, statusFilter, emailFilter]);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['ID,Member ID,Name,Phone,Email,City,State,Gyms,Status,Verified'];
    const rows = filteredMembers.map((m) =>
      `${m.id},"${m.memberId}","${m.name}","${m.phone}","${m.email}","${m.city}","${m.state}",${m.gyms},"${m.status}",${m.verified}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zymgoo_members_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notify(`Exported ${filteredMembers.length} member records to CSV`);
  };

  // Add Member submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'MB';
    const newId = membersList.length + 1;
    const newMemberId = `00000${19180 - membersList.length}`;

    const newEntry = {
      id: newId,
      name: formData.name,
      memberId: newMemberId,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      city: formData.city || 'Jamshedpur',
      state: formData.state || 'Jharkhand',
      gyms: Number(formData.gyms) || 1,
      status: formData.status,
      verified: formData.verified,
      initials,
      avatarBg: '#ffedd5',
      avatarColor: '#ea580c'
    };

    setMembersList([newEntry, ...membersList]);
    setIsAddModalOpen(false);
    setFormData({ name: '', phone: '', email: '', city: '', state: '', gyms: 1, status: 'Active', verified: true });
    notify(`Member "${newEntry.name}" added successfully!`);
  };

  // Edit Member submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingMember) return;

    setMembersList(membersList.map((m) => m.id === editingMember.id ? editingMember : m));
    notify(`Member "${editingMember.name}" updated successfully!`);
    setEditingMember(null);
  };

  // Delete Member
  const handleDeleteMember = (id, name) => {
    setMembersList(membersList.filter(m => m.id !== id));
    notify(`Member "${name}" deleted.`);
  };

  return (
    <div className="members-page">
      {/* Page Top Header Bar */}
      <div className="members-header">
        <div className="members-header-title">
          <h1>Members</h1>
          <p>Gym owners registered on the Zymgoo platform</p>
        </div>

        <div className="members-header-actions">
          <button
            className="btn-add-member"
            onClick={() => {
              if (onNavigateToAddMember) {
                onNavigateToAddMember();
              } else {
                setIsAddModalOpen(true);
              }
            }}
          >
            <Plus size={18} />
            <span>Add Member</span>
          </button>
          <button
            className="btn-bulk-upload"
            onClick={() => {
              if (onNavigateToBulkUpload) {
                onNavigateToBulkUpload();
              } else {
                setIsBulkModalOpen(true);
              }
            }}
          >
            <Upload size={18} />
            <span>Bulk Upload</span>
          </button>
        </div>
      </div>

      {/* 5 Top Stat Cards */}
      <div className="members-stats-grid">
        <div className="stat-box-card">
          <div className="stat-icon-square blue">
            <Users size={22} />
          </div>
          <div className="stat-box-info">
            <span className="stat-box-number">18,075</span>
            <span className="stat-box-label">Total Members</span>
          </div>
        </div>

        <div className="stat-box-card">
          <div className="stat-icon-square green">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-box-info">
            <span className="stat-box-number">17,462</span>
            <span className="stat-box-label">Active</span>
          </div>
        </div>

        <div className="stat-box-card">
          <div className="stat-icon-square grey">
            <Ban size={22} />
          </div>
          <div className="stat-box-info">
            <span className="stat-box-number">613</span>
            <span className="stat-box-label">Inactive</span>
          </div>
        </div>

        <div className="stat-box-card">
          <div className="stat-icon-square purple">
            <Mail size={22} />
          </div>
          <div className="stat-box-info">
            <span className="stat-box-number">17,449</span>
            <span className="stat-box-label">Email Verified</span>
          </div>
        </div>

        <div className="stat-box-card">
          <div className="stat-icon-square orange">
            <Building2 size={22} />
          </div>
          <div className="stat-box-info">
            <span className="stat-box-number">17,862</span>
            <span className="stat-box-label">Total Gyms</span>
          </div>
        </div>
      </div>

      {/* Charts Section: Bar Chart & Donut Chart */}
      <div className="members-charts-grid">
        {/* Left Card: State-wise Distribution */}
        <div className="chart-box-card">
          <div className="chart-box-header">
            <h3>State-wise Distribution <span>(Top 10)</span></h3>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stateDistributionData}
                margin={{ top: 10, right: 10, left: -20, bottom: 45 }}
              >
                <XAxis
                  dataKey="state"
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  interval={0}
                  angle={-40}
                  textAnchor="end"
                />
                <YAxis
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  formatter={(val) => [`${val} members`, 'Count']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stateDistributionData.map((entry, idx) => (
                    <Cell key={`bar-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Card: Top Cities Donut Chart */}
        <div className="chart-box-card">
          <div className="chart-box-header">
            <h3>Top Cities <span>(Top 12)</span></h3>
          </div>

          <div className="donut-wrapper">
            <div style={{ width: 170, height: 170, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topCitiesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {topCitiesData.map((entry, idx) => (
                      <Cell key={`donut-${idx}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name, props) => [`${val}%`, props.payload.city]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom 2-Column Legend */}
            <div className="donut-legend-grid">
              {topCitiesData.map((item) => (
                <div key={item.city} className="donut-legend-item">
                  <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                  <span>{item.city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters Controls Container */}
      <div className="members-filter-card">
        <div className="filter-row-main">
          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="search-input-field"
              placeholder="Search ID, name, mobile, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* All States Dropdown */}
          <select
            className="filter-select"
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setCityFilter('All');
            }}
          >
            <option value="All">All States</option>
            {Object.keys(stateCityMap).sort().map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* All Cities Dropdown */}
          <select
            className="filter-select"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="All">All Cities</option>
            {stateFilter !== 'All' && stateCityMap[stateFilter]
              ? stateCityMap[stateFilter].sort().map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))
              : Array.from(new Set(Object.values(stateCityMap).flat())).sort().map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))
            }
          </select>

          {/* All Status Dropdown */}
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Email Filter Dropdown */}
          <select
            className="filter-select"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          >
            <option value="All">Email: All</option>
            <option value="Verified">Email: Verified</option>
            <option value="Unverified">Email: Unverified</option>
          </select>
        </div>

        <div className="filter-row-secondary">
          <div className="per-page-group">
            <select
              className="filter-select"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
            >
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>

          <button className="btn-search-submit" onClick={() => notify(`Found ${filteredMembers.length} matching members`)}>
            <span>Search</span>
          </button>

          <button className="btn-export-csv" onClick={handleExportCSV}>
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Members Main Table */}
      <div className="members-table-card">
        <div className="table-card-header">
          <h4>{filteredMembers.length.toLocaleString()} members</h4>
          <span>Showing 1–{Math.min(filteredMembers.length, Number(pageSize))}</span>
        </div>

        <div className="table-responsive">
          <table className="members-custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>MEMBER</th>
                <th>CONTACT</th>
                <th>LOCATION</th>
                <th>GYMS</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.slice(0, Number(pageSize)).map((member, index) => (
                  <tr key={member.id}>
                    <td className="row-id-number">{index + 1}</td>

                    {/* MEMBER */}
                    <td>
                      <div className="member-cell-group">
                        <div
                          className="member-avatar-circle"
                          style={{ backgroundColor: member.avatarBg, color: member.avatarColor }}
                        >
                          {member.initials}
                        </div>
                        <div className="member-name-info">
                          <span className="member-name-title" style={{ cursor: 'pointer' }} onClick={() => onSelectMember ? onSelectMember(member) : setViewingMember(member)}>{member.name}</span>
                          <span className="member-code-sub">{member.memberId}</span>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td>
                      <div className="contact-cell-group">
                        <span className="contact-phone">{member.phone}</span>
                        <span className="contact-email">{member.email}</span>
                      </div>
                    </td>

                    {/* LOCATION */}
                    <td>
                      <div className="location-cell-group">
                        <span className="location-city">{member.city}</span>
                        <span className="location-state">{member.state}</span>
                      </div>
                    </td>

                    {/* GYMS */}
                    <td>
                      <div className="gym-badge-count">{member.gyms}</div>
                    </td>

                    {/* STATUS */}
                    <td>
                      <div className="status-pills-group">
                        <span className={`status-pill ${member.status.toLowerCase()}`}>
                          • {member.status}
                        </span>
                        {member.verified && (
                          <span className="status-pill verified">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </td>

                    {/* ACTION */}
                    <td>
                      <div className="action-buttons-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="action-btn-icon view"
                          title="View Details"
                          onClick={() => onSelectMember ? onSelectMember(member) : setViewingMember(member)}
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          className="action-btn-icon edit"
                          title="Edit Member"
                          onClick={() => setEditingMember(member)}
                        >
                          <Edit size={17} />
                        </button>
                        <button
                          className="action-btn-icon delete"
                          title="Delete Member"
                          onClick={() => setDeleteModal({ isOpen: true, id: member.id, title: member.name })}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                    No member records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="table-pagination-footer">
          <span style={{ fontSize: 13, color: '#64748b' }}>
            Showing 1 to {Math.min(filteredMembers.length, Number(pageSize))} of {filteredMembers.length} entries
          </span>

          <div className="pagination-controls">
            <button className="page-num-btn" onClick={() => notify('Previous Page')}>
              <ChevronLeft size={16} />
            </button>
            <button className="page-num-btn active">1</button>
            <button className="page-num-btn" onClick={() => notify('Page 2')}>2</button>
            <button className="page-num-btn" onClick={() => notify('Next Page')}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Add Member */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Member</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="form-group">
                <label>Member / Gym Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Fitness Gym"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="10-digit mobile"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Email Verified</label>
                  <select
                    value={formData.verified ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.value === 'yes' })}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-orange">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Member Details */}
      {viewingMember && (
        <div className="modal-backdrop" onClick={() => setViewingMember(null)}>
          <div className="modal-container" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Member Profile & Details</h3>
              <button className="modal-close-btn" onClick={() => setViewingMember(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Member Profile Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, backgroundColor: '#f8fafc', borderRadius: 14, border: '1px solid #f1f5f9' }}>
                <div 
                  className="member-avatar-circle" 
                  style={{ 
                    backgroundColor: viewingMember.avatarBg, 
                    color: viewingMember.avatarColor, 
                    width: 60, 
                    height: 60, 
                    fontSize: 20, 
                    fontWeight: 800 
                  }}
                >
                  {viewingMember.initials}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{viewingMember.name}</h3>
                    <span className={`status-pill ${viewingMember.status.toLowerCase()}`}>
                      • {viewingMember.status}
                    </span>
                    {viewingMember.verified && (
                      <span className="status-pill verified">✓ Verified</span>
                    )}
                  </div>
                  <span style={{ fontSize: 13, color: '#64748b', fontFamily: 'monospace' }}>Member ID: {viewingMember.memberId}</span>
                </div>
              </div>

              {/* Personal & Contact Grid */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 10 }}>Personal & Contact Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Mobile Number:</span> <div style={{ fontWeight: 600, color: '#0f172a' }}>{viewingMember.phone}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Email Address:</span> <div style={{ fontWeight: 600, color: '#0f172a' }}>{viewingMember.email}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>City / Location:</span> <div style={{ fontWeight: 600, color: '#0f172a' }}>{viewingMember.city}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>State:</span> <div style={{ fontWeight: 600, color: '#0f172a' }}>{viewingMember.state}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Country:</span> <div style={{ fontWeight: 600, color: '#0f172a' }}>India</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Registered Date:</span> <div style={{ fontWeight: 600, color: '#0f172a' }}>Wednesday, July 22, 2026</div></div>
                </div>
              </div>

              {/* Gym & Membership Grid */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 10 }}>Gym & Membership Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Gyms Registered:</span> <div style={{ fontWeight: 700, color: '#ea580c' }}>{viewingMember.gyms} Gym(s)</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Membership Plan:</span> <div style={{ fontWeight: 600, color: '#16a34a' }}>Pro Annual Membership</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Email Verification:</span> <div style={{ fontWeight: 600, color: viewingMember.verified ? '#9333ea' : '#64748b' }}>{viewingMember.verified ? 'Verified ✓' : 'Unverified'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: 12.5 }}>Account Status:</span> <div style={{ fontWeight: 600, color: '#16a34a' }}>{viewingMember.status}</div></div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setViewingMember(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Member */}
      <EditMemberModal
        isOpen={!!editingMember}
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSave={(updatedData) => {
          setMembersList(membersList.map(m => m.id === editingMember.id ? { ...m, ...updatedData } : m));
          notify(`Member "${updatedData.name}" updated successfully!`);
          setEditingMember(null);
        }}
      />

      {/* Modal: Bulk Upload */}
      {isBulkModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsBulkModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bulk Upload Members</h3>
              <button className="modal-close-btn" onClick={() => setIsBulkModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: 12, padding: 32, backgroundColor: '#f8fafc' }}>
                <Upload size={36} style={{ color: '#10b981', marginBottom: 12 }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Upload CSV or Excel file</h4>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Drag and drop your member CSV file here, or click to browse</p>
                <button
                  className="btn-bulk-upload"
                  style={{ marginTop: 16 }}
                  onClick={() => {
                    setIsBulkModalOpen(false);
                    notify('Bulk upload completed! 25 new members imported.');
                  }}
                >
                  Select File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Member"
        itemName={deleteModal.title}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={() => {
          handleDeleteMember(deleteModal.id, deleteModal.title);
          setDeleteModal({ isOpen: false, id: null, title: '' });
        }}
      />
    </div>
  );
}
