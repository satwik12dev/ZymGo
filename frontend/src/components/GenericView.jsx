import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';

export default function GenericView({ title, path, onActionTrigger }) {
  const [search, setSearch] = useState('');

  const formattedTitle = title || (path ? path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').replace(/&/g, ' & ') : 'Module');
  const capitalizedTitle = formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);

  return (
    <div className="members-page">
      {/* Header */}
      <div className="members-header">
        <div className="members-header-title">
          <h1 style={{ textTransform: 'capitalize' }}>{capitalizedTitle}</h1>
          <p>Management portal & records for {capitalizedTitle}</p>
        </div>

        <div className="members-header-actions">
          <button
            className="btn-add-member"
            onClick={() => onActionTrigger && onActionTrigger(`Added new record in ${capitalizedTitle}`)}
          >
            <Plus size={18} />
            <span>Create {capitalizedTitle}</span>
          </button>
          <button
            className="btn-bulk-upload"
            onClick={() => onActionTrigger && onActionTrigger(`Exported ${capitalizedTitle} data`)}
          >
            <Download size={18} />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="members-stats-grid">
        <div className="stat-box-card">
          <div className="stat-icon-square blue">
            <FileText size={22} />
          </div>
          <div className="stat-box-info">
            <span className="stat-box-number">1,248</span>
            <span className="stat-box-label">Total Records</span>
          </div>
        </div>

        <div className="stat-box-card">
          <div className="stat-icon-square green">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-box-info">
            <span className="stat-box-number">1,180</span>
            <span className="stat-box-label">Active / Synced</span>
          </div>
        </div>

        <div className="stat-box-card">
          <div className="stat-icon-square orange">
            <Clock size={22} />
          </div>
          <div className="stat-box-info">
            <span className="stat-box-number">48</span>
            <span className="stat-box-label">Pending Approval</span>
          </div>
        </div>

        <div className="stat-box-card">
          <div className="stat-icon-square purple">
            <TrendingUp size={22} />
          </div>
          <div className="stat-box-info">
            <span className="stat-box-number">+14.2%</span>
            <span className="stat-box-label">Monthly Growth</span>
          </div>
        </div>

        <div className="stat-box-card">
          <div className="stat-icon-square grey">
            <SlidersHorizontal size={22} />
          </div>
          <div className="stat-box-info">
            <span className="stat-box-number">v2.4</span>
            <span className="stat-box-label">Module Version</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="members-filter-card">
        <div className="filter-row-main">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="search-input-field"
              placeholder={`Search ${capitalizedTitle}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="filter-select">
            <option value="All">All Categories</option>
            <option value="Active">Active Only</option>
            <option value="Recent">Recent 30 Days</option>
          </select>

          <select className="filter-select">
            <option value="All">Status: All</option>
            <option value="Approved">Approved</option>
            <option value="Draft">Draft</option>
          </select>

          <button
            className="btn-search-submit"
            onClick={() => onActionTrigger && onActionTrigger(`Searched for "${search}" in ${capitalizedTitle}`)}
          >
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="members-table-card">
        <div className="table-card-header">
          <h4>{capitalizedTitle} Directory</h4>
          <span>Showing 1–5 of 1,248</span>
        </div>

        <div className="table-responsive">
          <table className="members-custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>NAME / TITLE</th>
                <th>PATH / CODE</th>
                <th>LAST UPDATED</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: `${capitalizedTitle} Item #101`, code: path || '/sys/01', updated: 'Today, 10:45 AM', status: 'Active' },
                { id: 2, name: `${capitalizedTitle} Item #102`, code: path || '/sys/02', updated: 'Yesterday', status: 'Active' },
                { id: 3, name: `${capitalizedTitle} Item #103`, code: path || '/sys/03', updated: 'July 20, 2026', status: 'Active' },
                { id: 4, name: `${capitalizedTitle} Item #104`, code: path || '/sys/04', updated: 'July 18, 2026', status: 'Pending' },
                { id: 5, name: `${capitalizedTitle} Item #105`, code: path || '/sys/05', updated: 'July 15, 2026', status: 'Active' },
              ].map((row) => (
                <tr key={row.id}>
                  <td className="row-id-number">{row.id}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{row.name}</td>
                  <td style={{ fontFamily: 'monospace', color: '#64748b' }}>{row.code}</td>
                  <td style={{ color: '#64748b' }}>{row.updated}</td>
                  <td>
                    <span className={`status-pill ${row.status.toLowerCase()}`}>
                      • {row.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-search-submit"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => onActionTrigger && onActionTrigger(`Viewing details for ${row.name}`)}
                    >
                      View Details
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
