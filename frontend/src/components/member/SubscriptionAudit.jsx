import React, { useState, useMemo } from 'react';
import { Search, Printer, Calendar, ShieldCheck, UserCheck } from 'lucide-react';
import './SubscriptionAudit.css';

const sampleAuditLogs = [
  {
    id: 1,
    dateTime: '2026-07-22 14:15:30',
    employee: 'Kodexive Gym (Super Admin)',
    action: 'Plan Assigned',
    details: 'Assigned 1 Month Plan (₹0.00) to Fitness point (ID: 014415)',
    ip: '103.145.72.18'
  },
  {
    id: 2,
    dateTime: '2026-07-21 11:30:12',
    employee: 'Kodexive Gym (Super Admin)',
    action: 'Plan Renewed',
    details: 'Renewed 1 Year Plan (₹5,999.00) for MD Fitness Gym (ID: 000174)',
    ip: '103.145.72.18'
  },
  {
    id: 3,
    dateTime: '2026-07-20 09:45:00',
    employee: 'Rahul Sharma (Sales Admin)',
    action: 'Plan Assigned',
    details: 'Assigned 3 Month Plan (₹999.00) to A super power bodybuilding gym (ID: 019180)',
    ip: '157.32.19.45'
  }
];

export default function SubscriptionAudit({ onActionTrigger }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const filteredLogs = useMemo(() => {
    if (!isSearched) return [];
    return sampleAuditLogs.filter((log) => {
      const matchesSearch = 
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEmp = employeeFilter === 'All' || log.employee.includes(employeeFilter);
      return matchesSearch && matchesEmp;
    });
  }, [searchQuery, employeeFilter, isSearched]);

  const handleSearch = () => {
    setIsSearched(true);
    if (onActionTrigger) onActionTrigger(`Searched subscription audit logs`);
  };

  const handlePrintExport = () => {
    window.print();
    if (onActionTrigger) onActionTrigger(`Printing / Exporting Subscription Audit Trail`);
  };

  return (
    <div className="subscription-audit-page">
      {/* Top Title Bar */}
      <div className="audit-title-header">
        <div className="audit-title-group">
          <h1>Subscription Audit Trail</h1>
          <p>Track every subscription action — who did what, when, and for how much</p>
        </div>

        <button className="btn-print-export-white" onClick={handlePrintExport}>
          <Printer size={16} />
          <span>Print / Export</span>
        </button>
      </div>

      {/* 5 Top Stat Cards Row */}
      <div className="audit-stats-grid-5">
        <div className="audit-stat-card-box">
          <span className="audit-stat-num-val blue">{isSearched ? filteredLogs.length : 0}</span>
          <span className="audit-stat-lbl-sub">Total Actions</span>
        </div>

        <div className="audit-stat-card-box">
          <span className="audit-stat-num-val green">{isSearched ? filteredLogs.filter(l => l.action.includes('Assigned')).length : 0}</span>
          <span className="audit-stat-lbl-sub">Assignments</span>
        </div>

        <div className="audit-stat-card-box">
          <span className="audit-stat-num-val purple">{isSearched ? filteredLogs.filter(l => l.action.includes('Renewed')).length : 0}</span>
          <span className="audit-stat-lbl-sub">Renewals</span>
        </div>

        <div className="audit-stat-card-box">
          <span className="audit-stat-num-val red">0</span>
          <span className="audit-stat-lbl-sub">Cancellations</span>
        </div>

        <div className="audit-stat-card-box">
          <span className="audit-stat-num-val orange">{isSearched ? 1 : 0}</span>
          <span className="audit-stat-lbl-sub">Admins Involved</span>
        </div>
      </div>

      {/* Filter Card */}
      <div className="audit-filter-card">
        <div className="audit-search-wrapper">
          <Search size={16} />
          <input 
            type="text" 
            className="audit-search-input-field" 
            placeholder="Search gym, plan, adm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="audit-filter-field-group">
          <select 
            className="audit-select-field"
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
          >
            <option value="All">All Employees</option>
            <option value="Kodexive Gym">Kodexive Gym (Super Admin)</option>
            <option value="Rahul Sharma">Rahul Sharma (Sales Admin)</option>
          </select>
        </div>

        <div className="audit-filter-field-group">
          <label>From</label>
          <input 
            type="date" 
            className="audit-date-input-field" 
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="audit-filter-field-group">
          <label>To</label>
          <input 
            type="date" 
            className="audit-date-input-field" 
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button className="btn-audit-search-navy" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Audit Logs Table Card */}
      <div className="audit-table-card">
        <div className="audit-table-header">
          <h4>{filteredLogs.length} log entries</h4>
        </div>

        <div className="table-responsive">
          <table className="audit-custom-table">
            <thead>
              <tr>
                <th>DATE / TIME</th>
                <th>EMPLOYEE</th>
                <th>ACTION</th>
                <th>DETAILS</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{log.dateTime}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{log.employee}</td>
                    <td>
                      <span className="status-pill active" style={{ fontSize: 11 }}>
                        • {log.action}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: '#334155' }}>{log.details}</td>
                    <td style={{ fontFamily: 'monospace', color: '#64748b', fontSize: 12 }}>{log.ip}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="audit-empty-row-td">
                    No subscription logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
