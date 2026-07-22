import React, { useState } from 'react';
import { ShieldCheck, Check, Save } from 'lucide-react';
import './RolesPermissions.css';

const initialRoles = [
  { id: 1, name: 'Super Admin', slug: 'super_admin', status: 'Active' },
  { id: 2, name: 'Admin', slug: 'admin', status: 'Active' },
  { id: 3, name: 'Manager', slug: 'manager', status: 'Active' },
  { id: 4, name: 'Staff', slug: 'staff', status: 'Active' },
  { id: 5, name: 'Receptionist', slug: 'receptionist', status: 'Active' },
  { id: 6, name: 'Sales', slug: 'sales_person', status: 'Active' }
];

const initialPermissions = {
  EXPENSES: [
    { title: 'View Expenses', slug: 'view_expenses', checked: true },
    { title: 'Add Expenses', slug: 'add_expenses', checked: true },
    { title: 'Edit Expenses', slug: 'edit_expenses', checked: true },
    { title: 'Delete Expenses', slug: 'delete_expenses', checked: true }
  ],
  INCOME: [
    { title: 'View Income', slug: 'view_income', checked: true },
    { title: 'Add Income', slug: 'add_income', checked: true },
    { title: 'Edit Income', slug: 'edit_income', checked: true },
    { title: 'Delete Income', slug: 'delete_income', checked: true }
  ],
  MEMBERS: [
    { title: 'View Members', slug: 'view_members', checked: true },
    { title: 'Add Members', slug: 'add_members', checked: true },
    { title: 'Edit Members', slug: 'edit_members', checked: true },
    { title: 'Delete Members', slug: 'delete_members', checked: true },
    { title: 'Export Members', slug: 'export_members', checked: true }
  ],
  PAYMENTS: [
    { title: 'View Payments', slug: 'view_payments', checked: true },
    { title: 'Add Payments', slug: 'add_payments', checked: true },
    { title: 'Edit Payments', slug: 'edit_payments', checked: true },
    { title: 'Delete Payments', slug: 'delete_payments', checked: true },
    { title: 'Generate Invoice', slug: 'generate_invoice', checked: true }
  ],
  PLANS: [
    { title: 'View Plans', slug: 'view_plans', checked: true },
    { title: 'Add Plans', slug: 'add_plans', checked: true },
    { title: 'Edit Plans', slug: 'edit_plans', checked: true },
    { title: 'Delete Plans', slug: 'delete_plans', checked: true }
  ],
  REPORTS: [
    { title: 'View Reports', slug: 'view_reports', checked: true },
    { title: 'Export Reports', slug: 'export_reports', checked: true }
  ],
  ROLES: [
    { title: 'View Roles', slug: 'view_roles', checked: true },
    { title: 'Add Roles', slug: 'add_roles', checked: true },
    { title: 'Edit Roles', slug: 'edit_roles', checked: true },
    { title: 'Delete Roles', slug: 'delete_roles', checked: true },
    { title: 'Assign Permissions', slug: 'assign_permissions', checked: true }
  ],
  SETTINGS: [
    { title: 'View Settings', slug: 'view_settings', checked: true },
    { title: 'Edit Settings', slug: 'edit_settings', checked: true }
  ],
  USERS: [
    { title: 'View Users', slug: 'view_users', checked: true },
    { title: 'Add Users', slug: 'add_users', checked: true },
    { title: 'Edit Users', slug: 'edit_users', checked: true },
    { title: 'Delete Users', slug: 'delete_users', checked: true }
  ],
  ATTENDANCE: [
    { title: 'View Attendance', slug: 'view_attendance', checked: true },
    { title: 'Mark Attendance', slug: 'mark_attendance', checked: true },
    { title: 'Edit Attendance', slug: 'edit_attendance', checked: true },
    { title: 'Delete Attendance', slug: 'delete_attendance', checked: true }
  ],
  DASHBOARD: [
    { title: 'View Dashboard', slug: 'view_dashboard', checked: true },
    { title: 'View Analytics', slug: 'view_analytics', checked: true }
  ],
  ENQUIRY: [
    { title: 'View Enquiry', slug: 'view_enquiry', checked: true },
    { title: 'Add Enquiry', slug: 'add_enquiry', checked: true },
    { title: 'Edit Enquiry', slug: 'edit_enquiry', checked: true },
    { title: 'Delete Enquiry', slug: 'delete_enquiry', checked: true }
  ]
};

const initialUserRoles = [
  { id: 20, name: 'Yuvraj Singh', handle: '@yuvrajshingh', email: 'singhyuvraj0374@gmail.com', phone: '7505690374', role: 'Admin' },
  { id: 19, name: 'Abhay Raj', handle: '@abhay_raj', email: 'ar747178@gmail.com', phone: '8630784021', role: 'Admin' },
  { id: 8, name: 'Vishal', handle: '@vishalkodexive', email: 'vishalkodexive@gmail.com', phone: '7983573567', role: 'Admin' },
  { id: 7, name: 'Rohit', handle: '@rohitkodexive', email: 'rohitkodexive50@gmail.com', phone: '7055503724', role: 'Super Admin' },
  { id: 6, name: 'Bhawna', handle: '@BHM0001', email: 'kodexivebhawna@gmail.com', phone: '7078423332', role: 'Admin' },
  { id: 5, name: 'Rohit Kumar', handle: '@RK0308', email: 'rk.goutam1994@gmail.com', phone: '8218832132', role: 'Super Admin' },
  { id: 1, name: 'Kodexive Gym', handle: '@kodexive', email: 'admin@gmail.com', phone: '9319333533', role: 'Super Admin' }
];

export default function RolesPermissions({ onActionTrigger }) {
  const [roles, setRoles] = useState(initialRoles);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [userRoles, setUserRoles] = useState(initialUserRoles);
  const [selectedRole, setSelectedRole] = useState('Super Admin');

  // Form State for New Role
  const [roleName, setRoleName] = useState('');
  const [isActiveRole, setIsActiveRole] = useState(true);

  const autoSlug = roleName.trim().toLowerCase().replace(/\s+/g, '_');

  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      if (onActionTrigger) onActionTrigger('Please enter Role Name');
      return;
    }
    const newRoleObj = {
      id: Date.now(),
      name: roleName,
      slug: autoSlug || 'custom_role',
      status: isActiveRole ? 'Active' : 'Inactive'
    };
    setRoles([...roles, newRoleObj]);
    setRoleName('');
    if (onActionTrigger) onActionTrigger(`Created role "${newRoleObj.name}" successfully!`);
  };

  const handleTogglePermission = (categoryKey, permSlug) => {
    setPermissions((prev) => {
      const updatedCat = prev[categoryKey].map((p) =>
        p.slug === permSlug ? { ...p, checked: !p.checked } : p
      );
      return { ...prev, [categoryKey]: updatedCat };
    });
  };

  const handleSavePermissions = () => {
    if (onActionTrigger) onActionTrigger(`Permissions updated for role "${selectedRole}"`);
  };

  const handleUserRoleChange = (userId, newRole) => {
    setUserRoles((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleSaveUserRole = (user) => {
    if (onActionTrigger) onActionTrigger(`Assigned role "${user.role}" to ${user.name}`);
  };

  return (
    <div className="roles-permissions-page">
      {/* Title Header */}
      <div className="roles-page-header">
        <h1>Roles & Permissions</h1>
        <p>Wednesday, July 22, 2026</p>
      </div>

      {/* Row 1: Create Role & Roles List */}
      <div className="roles-top-row">
        {/* Create Role Box */}
        <div className="roles-card-box">
          <div className="roles-card-header">
            <h3>Create Role</h3>
            <p>Add a new role to the system.</p>
          </div>

          <form onSubmit={handleCreateRole}>
            <div className="role-form-group">
              <label className="role-form-label">Role Name</label>
              <input
                type="text"
                className="role-input-field"
                placeholder="e.g. Sales Manager"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </div>

            <div className="role-form-group">
              <label className="role-form-label">Role Slug (auto-generated)</label>
              <input
                type="text"
                className="role-input-field"
                placeholder="sales_manager"
                value={autoSlug}
                readOnly
                style={{ background: '#F8FAFC' }}
              />
              <span className="role-form-sublabel">Spaces become underscores automatically</span>
            </div>

            <label className="role-checkbox-label">
              <input
                type="checkbox"
                className="role-checkbox-input"
                checked={isActiveRole}
                onChange={(e) => setIsActiveRole(e.target.checked)}
              />
              <span>Active role</span>
            </label>

            <button type="submit" className="btn-create-role-orange">
              Create Role
            </button>
          </form>
        </div>

        {/* Roles List Box */}
        <div className="roles-card-box">
          <div className="roles-card-header">
            <h3>Roles List</h3>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table className="roles-custom-table">
              <thead>
                <tr>
                  <th>ROLE</th>
                  <th>SLUG</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{r.name}</td>
                    <td className="role-slug-code">{r.slug}</td>
                    <td>
                      <span className="status-active-tag">{r.status}</span>
                    </td>
                    <td>
                      <button
                        className="btn-manage-permissions-link"
                        onClick={() => {
                          setSelectedRole(r.name);
                          if (onActionTrigger) onActionTrigger(`Managing permissions for ${r.name}`);
                        }}
                      >
                        Manage Permissions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 2: Role Permissions Matrix Cards */}
      <div className="role-permissions-section">
        <div className="roles-card-header" style={{ marginBottom: 8 }}>
          <h3>Role Permissions</h3>
          <p>Role select karke permissions assign karo. User ko role assign karte hi ye access apply ho jayega.</p>
        </div>

        <div className="role-select-row">
          <span>Role</span>
          <select
            className="role-select-dropdown"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3 Columns Permissions Cards Grid */}
        <div className="permissions-cards-grid">
          {Object.keys(permissions).map((catKey) => (
            <div key={catKey} className="perm-cat-card">
              <span className="perm-cat-title">{catKey}</span>
              <div className="perm-checkbox-group">
                {permissions[catKey].map((perm) => (
                  <label key={perm.slug} className="perm-item-label">
                    <input
                      type="checkbox"
                      className="perm-checkbox"
                      checked={perm.checked}
                      onChange={() => handleTogglePermission(catKey, perm.slug)}
                    />
                    <div className="perm-text-group">
                      <span className="perm-name-title">{perm.title}</span>
                      <span className="perm-slug-sub">{perm.slug}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="btn-save-permissions-orange" onClick={handleSavePermissions}>
          Save Permissions
        </button>
      </div>

      {/* Row 3: Assign Role to User Table */}
      <div className="assign-role-card">
        <div className="assign-role-header">
          <h3>Assign Role to User</h3>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table className="assign-role-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>CONTACT</th>
                <th>ROLE ASSIGNMENT</th>
                <th>PERMISSIONS</th>
              </tr>
            </thead>
            <tbody>
              {userRoles.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="assign-user-name">{user.name}</div>
                    <div className="assign-user-tag">#{user.id} · {user.handle}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: '#334155' }}>{user.email}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{user.phone}</div>
                  </td>
                  <td>
                    <div className="role-assign-group">
                      <select
                        className="role-select-mini"
                        value={user.role}
                        onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn-save-mini-blue"
                        onClick={() => handleSaveUserRole(user)}
                      >
                        Save
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-manage-permissions-link"
                      onClick={() => {
                        setSelectedRole(user.role);
                        if (onActionTrigger) onActionTrigger(`Viewing permissions for ${user.name} (${user.role})`);
                      }}
                    >
                      View Permissions
                    </button>
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
