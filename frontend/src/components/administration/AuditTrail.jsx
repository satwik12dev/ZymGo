import React, { useState } from 'react';
import './AuditTrail.css';

const initialAuditLogs = [
  { id: 1, time: '2026-07-22 16:42:45', admin: 'Kodexive Gym', module: 'auth', action: 'login', description: 'User logged in', ip: '172.71.124.52' },
  { id: 2, time: '2026-07-22 10:11:34', admin: 'Bhawna', module: 'auth', action: 'login', description: 'User logged in', ip: '104.23.216.114' },
  { id: 3, time: '2026-07-22 09:40:52', admin: 'Rohit', module: 'auth', action: 'login', description: 'User logged in', ip: '162.158.190.68' },
  { id: 4, time: '2026-07-22 09:19:52', admin: 'Vishal', module: 'auth', action: 'login', description: 'User logged in', ip: '104.23.216.114' },
  { id: 5, time: '2026-07-22 09:14:22', admin: 'Rohit', module: 'auth', action: 'login', description: 'User logged in', ip: '162.158.190.68' },
  { id: 6, time: '2026-07-22 08:43:42', admin: 'Kodexive Gym', module: 'auth', action: 'login', description: 'User logged in', ip: '108.162.227.61' },
  { id: 7, time: '2026-07-22 08:35:11', admin: 'Kodexive Gym', module: 'auth', action: 'login', description: 'User logged in', ip: '172.70.208.10' },
  { id: 8, time: '2026-07-22 08:29:37', admin: 'Bhawna', module: 'auth', action: 'login', description: 'User logged in', ip: '104.23.216.115' },
  { id: 9, time: '2026-07-22 07:15:28', admin: 'Bhawna', module: 'auth', action: 'login', description: 'User logged in', ip: '104.23.216.115' },
  { id: 10, time: '2026-07-22 06:28:19', admin: 'Kodexive Gym', module: 'auth', action: 'login', description: 'User logged in', ip: '172.71.124.53' },
  { id: 11, time: '2026-07-22 06:04:10', admin: 'Rohit', module: 'auth', action: 'login', description: 'User logged in', ip: '162.158.190.67' },
  { id: 12, time: '2026-07-22 05:17:25', admin: 'Kodexive Gym', module: 'auth', action: 'login', description: 'User logged in', ip: '172.69.176.66' },
  { id: 13, time: '2026-07-21 11:53:38', admin: 'Bhawna', module: 'auth', action: 'login', description: 'User logged in', ip: '104.23.216.114' },
  { id: 14, time: '2026-07-21 04:36:38', admin: 'Bhawna', module: 'auth', action: 'login', description: 'User logged in', ip: '104.23.216.114' },
  { id: 15, time: '2026-07-20 15:58:03', admin: 'Kodexive Gym', module: 'auth', action: 'login', description: 'User logged in', ip: '104.22.66.183' },
  { id: 16, time: '2026-07-20 11:34:33', admin: 'Bhawna', module: 'auth', action: 'login', description: 'User logged in', ip: '104.23.216.114' }
];

export default function AuditTrail({ onActionTrigger }) {
  const [fromDate, setFromDate] = useState('2026-06-22');
  const [toDate, setToDate] = useState('2026-07-22');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedAction, setSelectedAction] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleApplyFilter = () => {
    if (onActionTrigger) onActionTrigger('Applied filter on Audit Trail');
  };

  const handleResetFilter = () => {
    setFromDate('2026-06-22');
    setToDate('2026-07-22');
    setSelectedModule('All');
    setSelectedAction('All');
    setSearchQuery('');
    if (onActionTrigger) onActionTrigger('Reset Audit Trail filter');
  };

  const filteredLogs = initialAuditLogs.filter((log) => {
    if (selectedModule !== 'All' && log.module !== selectedModule) return false;
    if (selectedAction !== 'All' && log.action !== selectedAction) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.admin.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        log.ip.includes(q) ||
        log.time.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="audit-trail-page">
      {/* Title Header */}
      <div className="audit-page-header">
        <h1>Audit Trail</h1>
        <p>Admin actions, automation logs, and activity records</p>
      </div>

      {/* Filter Bar Box */}
      <div className="audit-filter-card-box">
        <div className="audit-filter-row">
          <div className="audit-filter-field">
            <span className="audit-filter-label">From</span>
            <input
              type="date"
              className="audit-input-date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="audit-filter-field">
            <span className="audit-filter-label">To</span>
            <input
              type="date"
              className="audit-input-date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="audit-filter-field">
            <span className="audit-filter-label">Module</span>
            <select
              className="audit-select-input"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
            >
              <option value="All">All</option>
              <option value="auth">auth</option>
              <option value="gyms">gyms</option>
              <option value="members">members</option>
              <option value="finance">finance</option>
              <option value="content">content</option>
              <option value="settings">settings</option>
            </select>
          </div>

          <div className="audit-filter-field">
            <span className="audit-filter-label">Action</span>
            <select
              className="audit-select-input"
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              <option value="All">All</option>
              <option value="login">login</option>
              <option value="create">create</option>
              <option value="update">update</option>
              <option value="delete">delete</option>
              <option value="export">export</option>
            </select>
          </div>

          <div className="audit-filter-field">
            <span className="audit-filter-label">Search</span>
            <input
              type="text"
              className="audit-input-text"
              placeholder="admin, ip, desc"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="audit-btn-apply" onClick={handleApplyFilter}>
            Apply
          </button>

          <button className="audit-btn-reset" onClick={handleResetFilter}>
            Reset
          </button>
        </div>
      </div>

      {/* Audit Records Table Box */}
      <div className="audit-table-card-box">
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table className="audit-custom-table">
            <thead>
              <tr>
                <th>TIME</th>
                <th>ADMIN</th>
                <th>MODULE</th>
                <th>ACTION</th>
                <th>DESCRIPTION</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="audit-time-text">{log.time}</td>
                  <td className="audit-admin-text">{log.admin}</td>
                  <td>
                    <span className="module-tag-pill">{log.module}</span>
                  </td>
                  <td>
                    <span className="action-tag-pill">{log.action}</span>
                  </td>
                  <td className="audit-desc-text">{log.description}</td>
                  <td className="audit-ip-text">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
