import React, { useState } from 'react';
import {
  Users as UsersIcon,
  CheckCircle2,
  FileText,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import './Users.css';

const initialUsersData = [
  {
    id: 1,
    name: 'Yuvraj Singh',
    username: '@yuvrajshingh',
    email: 'singhyuvraj0374@gmail.com',
    mobile: '7505690374',
    allGym: 21,
    todayGym: 0,
    role: 'Admin',
    status: 'Active',
    lastLoginDate: '08 Jul 2026',
    lastLoginTime: '22:03',
    initials: 'YU',
    bg: '#FFEDD5',
    color: '#EA580C'
  },
  {
    id: 2,
    name: 'Abhay Raj',
    username: '@abhay_raj',
    email: 'ar747178@gmail.com',
    mobile: '8630784021',
    allGym: 101,
    todayGym: 0,
    role: 'Admin',
    status: 'Active',
    lastLoginDate: '06 Jul 2026',
    lastLoginTime: '16:59',
    initials: 'AB',
    bg: '#DBEAFE',
    color: '#2563EB'
  },
  {
    id: 3,
    name: 'Vishal',
    username: '@vishalkodexive',
    email: 'vishalkodexive@gmail.com',
    mobile: '7983573567',
    allGym: 2865,
    todayGym: 131,
    role: 'Admin',
    status: 'Active',
    lastLoginDate: '22 Jul 2026',
    lastLoginTime: '14:49',
    initials: 'VI',
    bg: '#DCFCE7',
    color: '#16A34A'
  },
  {
    id: 4,
    name: 'Rohit',
    username: '@rohitkodexive',
    email: 'rohitkodexive50@gmail.com',
    mobile: '7055503724',
    allGym: 482,
    todayGym: 0,
    role: 'Super Admin',
    status: 'Active',
    lastLoginDate: '22 Jul 2026',
    lastLoginTime: '15:10',
    initials: 'RO',
    bg: '#F3E8FF',
    color: '#9333EA'
  },
  {
    id: 5,
    name: 'Bhawna',
    username: '@BHM0001',
    email: 'kodexivebhawna@gmail.com',
    mobile: '7078423332',
    allGym: 2479,
    todayGym: 145,
    role: 'Admin',
    status: 'Active',
    lastLoginDate: '22 Jul 2026',
    lastLoginTime: '15:41',
    initials: 'BH',
    bg: '#FCE7F3',
    color: '#DB2777'
  },
  {
    id: 6,
    name: 'Rohit Kumar',
    username: '@RK0308',
    email: 'rk.goutam1994@gmail.com',
    mobile: '8218832132',
    allGym: 0,
    todayGym: 0,
    role: 'Super Admin',
    status: 'Active',
    lastLoginDate: '29 Jun 2026',
    lastLoginTime: '16:22',
    initials: 'RO',
    bg: '#FEF3C7',
    color: '#D97706'
  },
  {
    id: 7,
    name: 'Kodexive Gym',
    isYou: true,
    username: '@kodexive',
    email: 'admin@gmail.com',
    mobile: '9319333533',
    allGym: 0,
    todayGym: 0,
    role: 'Super Admin',
    status: 'Active',
    lastLoginDate: '22 Jul 2026',
    lastLoginTime: '22:12',
    initials: 'KO',
    bg: '#DBEAFE',
    color: '#2563EB'
  }
];

export default function Users({ onActionTrigger, onNavigateToRoles }) {
  const [usersList, setUsersList] = useState(initialUsersData);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    username: '',
    email: '',
    password: '',
    role: 'Select role...'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (onActionTrigger) onActionTrigger('Please enter Name');
      return;
    }
    if (!formData.username.trim()) {
      if (onActionTrigger) onActionTrigger('Please enter Username');
      return;
    }
    if (!formData.password.trim()) {
      if (onActionTrigger) onActionTrigger('Please enter Password');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      username: formData.username.startsWith('@') ? formData.username : `@${formData.username}`,
      email: formData.email || 'admin@example.com',
      mobile: formData.mobile || '9876543210',
      allGym: 0,
      todayGym: 0,
      role: formData.role === 'Select role...' ? 'Admin' : formData.role,
      status: 'Active',
      lastLoginDate: 'Today',
      lastLoginTime: 'Just now',
      initials: formData.name.substring(0, 2).toUpperCase(),
      bg: '#DCFCE7',
      color: '#16A34A'
    };

    setUsersList([newUser, ...usersList]);
    setFormData({
      name: '',
      mobile: '',
      username: '',
      email: '',
      password: '',
      role: 'Select role...'
    });

    if (onActionTrigger) onActionTrigger(`Created admin user "${newUser.name}" successfully!`);
  };

  const filteredUsers = usersList.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.mobile.includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-users-page">
      {/* Hero Banner Header */}
      <div className="admin-users-hero">
        <div className="admin-users-hero-title">
          <h1>Users</h1>
          <p>Admin accounts and their access roles</p>
        </div>

        <button
          className="btn-roles-permissions"
          onClick={() => {
            if (onNavigateToRoles) onNavigateToRoles();
            if (onActionTrigger) onActionTrigger('Navigated to Roles & Permissions');
          }}
        >
          <Lock size={16} />
          <span>Roles & Permissions</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="admin-users-stats-grid">
        <div className="admin-user-stat-card">
          <div className="user-stat-icon-wrapper blue">
            <UsersIcon size={22} />
          </div>
          <div className="user-stat-info">
            <span className="user-stat-val">{usersList.length}</span>
            <span className="user-stat-lbl">Total Users</span>
          </div>
        </div>

        <div className="admin-user-stat-card">
          <div className="user-stat-icon-wrapper green">
            <CheckCircle2 size={22} />
          </div>
          <div className="user-stat-info">
            <span className="user-stat-val">{usersList.length}</span>
            <span className="user-stat-lbl">Active</span>
          </div>
        </div>

        <div className="admin-user-stat-card">
          <div className="user-stat-icon-wrapper purple">
            <FileText size={22} />
          </div>
          <div className="user-stat-info">
            <span className="user-stat-val">6</span>
            <span className="user-stat-lbl">Roles</span>
          </div>
        </div>

        <div className="admin-user-stat-card">
          <div className="user-stat-icon-wrapper orange">
            <Lock size={22} />
          </div>
          <div className="user-stat-info">
            <span className="user-stat-val">45</span>
            <span className="user-stat-lbl">Permissions</span>
          </div>
        </div>
      </div>

      {/* Create New User Card Form */}
      <div className="create-user-card">
        <div className="create-user-card-header">
          <div className="create-user-icon-square">
            <Plus size={20} />
          </div>
          <div className="create-user-header-text">
            <h3>Create New User</h3>
            <p>Add an admin account and assign a role</p>
          </div>
        </div>

        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="create-user-form-grid">
            <div className="user-form-group">
              <label className="user-form-label">Name *</label>
              <input
                type="text"
                name="name"
                className="user-input-field"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="user-form-group">
              <label className="user-form-label">Mobile</label>
              <input
                type="text"
                name="mobile"
                className="user-input-field"
                placeholder="10-digit number"
                value={formData.mobile}
                onChange={handleInputChange}
              />
            </div>

            <div className="user-form-group">
              <label className="user-form-label">Username *</label>
              <input
                type="text"
                name="username"
                className="user-input-field"
                placeholder="e.g. rahul.admin"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div className="user-form-group">
              <label className="user-form-label">Email</label>
              <input
                type="email"
                name="email"
                className="user-input-field"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="user-form-group">
              <label className="user-form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="user-input-field"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="user-form-group">
              <label className="user-form-label">Role *</label>
              <select
                name="role"
                className="user-select-field"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="Select role...">Select role...</option>
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Gym Manager">Gym Manager</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Support">Support</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-create-user-submit">
            Create User
          </button>
        </form>
      </div>

      {/* Admin Users Directory Table Box */}
      <div className="admin-users-table-card">
        <div className="table-card-top-bar">
          <h4>{filteredUsers.length} admin users</h4>

          <div className="user-table-search-wrapper">
            <Search size={16} className="user-table-search-icon" />
            <input
              type="text"
              className="user-table-search-input"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>CONTACT</th>
                <th>ALL GYM</th>
                <th>TODAY GYM</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>LAST LOGIN</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-profile-cell">
                      <div
                        className="user-avatar-circle"
                        style={{ backgroundColor: user.bg, color: user.color }}
                      >
                        {user.initials}
                      </div>
                      <div>
                        <div className="user-name-text">
                          {user.name}
                          {user.isYou && <span className="user-you-tag">(You)</span>}
                        </div>
                        <div className="user-handle-text">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-email-text">{user.email}</div>
                    <div className="contact-phone-text">{user.mobile}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{user.allGym}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{user.todayGym}</td>
                  <td>
                    <span className="role-pill-badge">{user.role}</span>
                  </td>
                  <td>
                    <span className="status-active-pill">• Active</span>
                  </td>
                  <td>
                    <div className="last-login-text">
                      <div>{user.lastLoginDate}</div>
                      <div style={{ color: '#94a3b8' }}>{user.lastLoginTime}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
