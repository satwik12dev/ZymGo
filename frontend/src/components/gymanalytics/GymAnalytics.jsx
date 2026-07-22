import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Star, 
  Award, 
  IndianRupee, 
  FileText, 
  Printer, 
  Calendar, 
  Clock, 
  Zap, 
  TrendingUp,
  Filter
} from 'lucide-react';
import './GymAnalytics.css';

const stateData = [
  { name: 'Uttar Pradesh', total: 3709, active: 3709, verified: 1924, percent: 37.1 },
  { name: 'Maharashtra', total: 2508, active: 2508, verified: 1421, percent: 25.1 },
  { name: 'Delhi', total: 1789, active: 1789, verified: 1697, percent: 17.9 },
  { name: 'Haryana', total: 1097, active: 1097, verified: 815, percent: 11.0 },
  { name: 'Karnataka', total: 998, active: 998, verified: 932, percent: 10.0 },
  { name: 'Rajasthan', total: 936, active: 936, verified: 236, percent: 9.4 }
];

const cityData = [
  { name: 'Bengaluru', state: 'Karnataka', total: 932, active: 932, verified: 932 },
  { name: 'New Delhi', state: 'Delhi', total: 880, active: 880, verified: 788 },
  { name: 'Hyderabad', state: 'Telangana', total: 839, active: 839, verified: 839 },
  { name: 'Mumbai', state: 'Maharashtra', total: 725, active: 725, verified: 706 },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', total: 701, active: 701, verified: 651 }
];

const topGyms = [
  { rank: 1, name: 'Body Being', location: 'Moradabad, Uttar Pradesh', subs: 1, revenue: '₹0' },
  { rank: 2, name: 'Wellness Gym Amroha', location: 'Amroha, Uttar Pradesh', subs: 0, revenue: '₹0' },
  { rank: 3, name: 'MSG-MAA SHARDA GYM', location: 'Amroha, Uttar Pradesh', subs: 0, revenue: '₹0' },
  { rank: 4, name: 'Elixir Fitness by Rashid', location: 'Amroha, Uttar Pradesh', subs: 0, revenue: '₹0' },
  { rank: 5, name: 'Nik Health Club', location: 'Amroha, Uttar Pradesh', subs: 1, revenue: '₹0' },
  { rank: 6, name: 'The gym amroha', location: 'Amroha, Uttar Pradesh', subs: 0, revenue: '₹0' },
  { rank: 7, name: 'SK Fitness Gym', location: 'Amroha, Uttar Pradesh', subs: 0, revenue: '₹0' },
  { rank: 8, name: 'Fitness station', location: 'Amroha, Uttar Pradesh', subs: 0, revenue: '₹0' },
  { rank: 9, name: 'Abbas Health Club Said Nagli', location: 'Amroha, Uttar Pradesh', subs: 0, revenue: '₹0' }
];

const expiringSubs = [
  { name: 'Testing Gym', location: 'Moradabad, Uttar Pradesh', days: '3d' },
  { name: 'MD Fitness Gym', location: 'Moradabad, Uttar Pradesh', days: '5d' }
];

export default function GymAnalytics({ onActionTrigger }) {
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-07-22');

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const downloadCSV = (filename, rows) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map(val => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Gyms', '17840'],
      ['Active Gyms', '17840'],
      ['Inactive Gyms', '0'],
      ['Verified Gyms', '9615'],
      ['Trusted Gyms', '0'],
      ['Subscribed Gyms', '5'],
      ['Unsubscribed Gyms', '17835'],
      ['Total Revenue', '0'],
      [''],
      ['State', 'Total Gyms', 'Active', 'Verified'],
      ...stateData.map(s => [s.name, s.total, s.active, s.verified]),
      [''],
      ['City', 'State', 'Total Gyms', 'Active', 'Verified'],
      ...cityData.map(c => [c.name, c.state, c.total, c.active, c.verified])
    ];
    downloadCSV('zymgoo_gym_analytics_summary.csv', rows);
    notify('Summary CSV report downloaded successfully!');
  };

  const handleExportFilters = () => {
    const rows = [
      ['Filter Parameter', 'Selected Value'],
      ['State Filter', selectedState],
      ['City Filter', selectedCity],
      ['From Date', fromDate],
      ['To Date', toDate],
      ['Report Generated At', '2026-07-22 05:26 PM'],
      [''],
      ['Gym Name', 'Location', 'Subscriptions', 'Revenue Status'],
      ...topGyms.map(g => [g.name, g.location, g.subs, g.revenue])
    ];
    const safeState = selectedState.replace(/\s+/g, '_');
    const safeCity = selectedCity.replace(/\s+/g, '_');
    downloadCSV(`zymgoo_analytics_filtered_${safeState}_${safeCity}.csv`, rows);
    notify(`Filtered CSV report exported for ${selectedState} - ${selectedCity}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="gym-analytics-page">
      {/* Top Header */}
      <div className="analytics-top-header">
        <div className="analytics-title-group">
          <h1>Gym Analytics</h1>
          <p>Updated 22 Jul 2026, 05:26 PM</p>
        </div>

        <div className="analytics-action-buttons">
          <button className="btn-export-green" onClick={handleExportCSV}>
            <FileText size={16} />
            <span>Export Summary CSV</span>
          </button>

          <button className="btn-export-blue" onClick={handleExportFilters}>
            <FileText size={16} />
            <span>Export with Filters</span>
          </button>

          <button className="btn-print-white" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Filter Control Card */}
      <div className="analytics-filter-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} style={{ color: '#ea580c' }} />
          <h4>Filters & Parameters</h4>
        </div>
        
        <div className="filter-controls-row">
          <div className="filter-control-group">
            <label>State</label>
            <select 
              className="analytics-select-input" 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="All States">All States</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Haryana">Haryana</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Rajasthan">Rajasthan</option>
            </select>
          </div>

          <div className="filter-control-group">
            <label>City</label>
            <select 
              className="analytics-select-input" 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="All Cities">All Cities</option>
              <option value="Moradabad">Moradabad</option>
              <option value="Amroha">Amroha</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>

          <div className="filter-control-group">
            <label>From</label>
            <input 
              type="date" 
              className="analytics-date-input" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
            />
          </div>

          <div className="filter-control-group">
            <label>To</label>
            <input 
              type="date" 
              className="analytics-date-input" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
            />
          </div>

          <button className="btn-apply-navy" onClick={() => notify('Filters applied to Gym Analytics')}>
            Apply
          </button>
        </div>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="analytics-metrics-grid">
        <div className="metric-kpi-card">
          <div className="metric-icon-circle blue">
            <Building2 size={20} />
          </div>
          <span className="metric-num">17,840</span>
          <span className="metric-lbl">Total</span>
        </div>

        <div className="metric-kpi-card">
          <div className="metric-icon-circle green">
            <CheckCircle2 size={20} />
          </div>
          <span className="metric-num">17,840</span>
          <span className="metric-lbl">Active</span>
        </div>

        <div className="metric-kpi-card">
          <div className="metric-icon-circle grey">
            <XCircle size={20} />
          </div>
          <span className="metric-num">0</span>
          <span className="metric-lbl">Inactive</span>
        </div>

        <div className="metric-kpi-card">
          <div className="metric-icon-circle light-blue">
            <ShieldCheck size={20} />
          </div>
          <span className="metric-num">9,615</span>
          <span className="metric-lbl">Verified</span>
        </div>

        <div className="metric-kpi-card">
          <div className="metric-icon-circle purple">
            <Star size={20} />
          </div>
          <span className="metric-num">0</span>
          <span className="metric-lbl">Trusted</span>
        </div>

        <div className="metric-kpi-card">
          <div className="metric-icon-circle blue">
            <Award size={20} />
          </div>
          <span className="metric-num">5</span>
          <span className="metric-lbl">Subscribed</span>
        </div>

        <div className="metric-kpi-card">
          <div className="metric-icon-circle red">
            <XCircle size={20} />
          </div>
          <span className="metric-num">17,835</span>
          <span className="metric-lbl">Unsubscribed</span>
        </div>

        <div className="metric-kpi-card">
          <div className="metric-icon-circle emerald">
            <IndianRupee size={20} />
          </div>
          <span className="metric-num">₹0</span>
          <span className="metric-lbl">Revenue</span>
        </div>
      </div>

      {/* Enhanced Donut Charts Grid (3 Columns) */}
      <div className="analytics-3col-grid">
        {/* Subscription Status Donut Chart */}
        <div className="chart-card" style={{ borderTop: '3px solid #ef4444' }}>
          <div className="chart-card-header">
            <h3>Subscription Status</h3>
          </div>

          <div className="donut-chart-wrapper">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="unsubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="subGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="75" fill="none" stroke="url(#unsubGrad)" strokeWidth="20" strokeLinecap="round" />
              <circle cx="100" cy="100" r="75" fill="none" stroke="url(#subGrad)" strokeWidth="20" strokeDasharray="6 460" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="donut-center-text">
              <span className="main-val">17,840</span>
              <span className="sub-val">Total Gyms</span>
            </div>
          </div>

          <div className="chart-legend-list">
            <div className="legend-item-row">
              <div className="legend-item-dot" style={{ background: 'linear-gradient(135deg, #f87171, #dc2626)' }} />
              <span>Unsubscribed (17,835)</span>
            </div>
            <div className="legend-item-row">
              <div className="legend-item-dot" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }} />
              <span>Subscribed (5)</span>
            </div>
          </div>
        </div>

        {/* Active vs Inactive Donut Chart */}
        <div className="chart-card" style={{ borderTop: '3px solid #10b981' }}>
          <div className="chart-card-header">
            <h3>Active vs Inactive</h3>
          </div>

          <div className="donut-chart-wrapper">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="75" fill="none" stroke="url(#activeGrad)" strokeWidth="20" strokeLinecap="round" />
            </svg>
            <div className="donut-center-text">
              <span className="main-val" style={{ color: '#059669' }}>100%</span>
              <span className="sub-val">Active Gyms</span>
            </div>
          </div>

          <div className="chart-legend-list">
            <div className="legend-item-row">
              <div className="legend-item-dot" style={{ background: 'linear-gradient(135deg, #34d399, #059669)' }} />
              <span>Active (17,840)</span>
            </div>
            <div className="legend-item-row">
              <div className="legend-item-dot" style={{ backgroundColor: '#cbd5e1' }} />
              <span>Inactive (0)</span>
            </div>
          </div>
        </div>

        {/* Subscription Plans Donut Chart */}
        <div className="chart-card" style={{ borderTop: '3px solid #ea580c' }}>
          <div className="chart-card-header">
            <h3>Subscription Plans</h3>
          </div>

          <div className="donut-chart-wrapper">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="planGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <linearGradient id="planGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="75" fill="none" stroke="url(#planGrad1)" strokeWidth="20" strokeLinecap="round" />
              <circle cx="100" cy="100" r="75" fill="none" stroke="url(#planGrad2)" strokeWidth="20" strokeDasharray="180 460" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="donut-center-text">
              <span className="main-val">5</span>
              <span className="sub-val">Active Plans</span>
            </div>
          </div>

          <div className="chart-legend-list">
            <div className="legend-item-row">
              <div className="legend-item-dot" style={{ background: 'linear-gradient(135deg, #fb923c, #ea580c)' }} />
              <span>1 Month Plan</span>
            </div>
            <div className="legend-item-row">
              <div className="legend-item-dot" style={{ background: 'linear-gradient(135deg, #60a5fa, #2563eb)' }} />
              <span>1 Year Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced State-wise & City-wise Horizontal Distribution Bar Charts */}
      <div className="analytics-2col-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>State-wise Distribution <span className="subtitle">(Top 10)</span></h3>
          </div>

          <div className="dist-bar-list">
            {stateData.map((st, idx) => (
              <div key={idx} className="dist-bar-item">
                <div className="dist-bar-label-row">
                  <div className="name-group">
                    <span className="rank-tag-small">#{idx + 1}</span>
                    <span className="name">{st.name}</span>
                  </div>
                  <span className="val">{st.total.toLocaleString()}</span>
                </div>
                <div className="dist-progress-track">
                  <div className="dist-progress-fill blue-gradient" style={{ width: `${st.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3>City-wise Distribution <span className="subtitle">(Top 15)</span></h3>
          </div>

          <div className="dist-bar-list">
            {cityData.map((ct, idx) => (
              <div key={idx} className="dist-bar-item">
                <div className="dist-bar-label-row">
                  <div className="name-group">
                    <span className="rank-tag-small" style={{ color: '#ea580c' }}>#{idx + 1}</span>
                    <span className="name">{ct.name}</span>
                  </div>
                  <span className="val" style={{ color: '#ea580c' }}>{ct.total.toLocaleString()}</span>
                </div>
                <div className="dist-progress-track">
                  <div className="dist-progress-fill orange-gradient" style={{ width: `${(ct.total / 932) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verified vs Unverified & Zymgoo Trusted Comparison Cards */}
      <div className="analytics-2col-grid">
        <div className="chart-card" style={{ borderTop: '3px solid #2563eb' }}>
          <div className="chart-card-header">
            <h3>Verified vs Unverified Gyms</h3>
          </div>

          <div className="donut-chart-wrapper">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="verifiedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="75" fill="none" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" />
              <circle cx="100" cy="100" r="75" fill="none" stroke="url(#verifiedGrad)" strokeWidth="20" strokeDasharray="248 460" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="donut-center-text">
              <span className="main-val" style={{ color: '#2563eb' }}>53.9%</span>
              <span className="sub-val">Verified</span>
            </div>
          </div>

          <div className="chart-legend-list">
            <div className="legend-item-row">
              <div className="legend-item-dot" style={{ background: 'linear-gradient(135deg, #60a5fa, #1d4ed8)' }} />
              <span>Verified (9,615)</span>
            </div>
            <div className="legend-item-row">
              <div className="legend-item-dot" style={{ backgroundColor: '#e2e8f0' }} />
              <span>Not Verified (8,225)</span>
            </div>
          </div>
        </div>

        <div className="chart-card" style={{ borderTop: '3px solid #9333ea' }}>
          <div className="chart-card-header">
            <h3>Zymgoo Trusted vs Not Trusted</h3>
          </div>

          <div className="donut-chart-wrapper">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="75" fill="none" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" />
            </svg>
            <div className="donut-center-text">
              <span className="main-val" style={{ color: '#64748b' }}>0%</span>
              <span className="sub-val">Trusted</span>
            </div>
          </div>

          <div className="chart-legend-list">
            <div className="legend-item-row">
              <div className="legend-item-dot" style={{ backgroundColor: '#9333ea' }} />
              <span>Zymgoo Trusted (0)</span>
            </div>
            <div className="legend-item-row">
              <div className="legend-item-dot" style={{ backgroundColor: '#e2e8f0' }} />
              <span>Not Trusted (17,840)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Data Tables (State-wise & City-wise Details) */}
      <div className="analytics-2col-grid">
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="chart-card-header" style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9' }}>
            <h3>State-wise Details</h3>
          </div>

          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>STATE</th>
                  <th>TOTAL</th>
                  <th>ACTIVE</th>
                  <th>VERIFIED</th>
                </tr>
              </thead>
              <tbody>
                {stateData.map((st, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{st.name}</div>
                      <div className="dist-progress-track" style={{ width: 100, height: 4, marginTop: 4 }}>
                        <div className="dist-progress-fill blue-gradient" style={{ width: `${st.percent}%` }} />
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{st.total.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: '#16a34a' }}>{st.active.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{st.verified.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="chart-card-header" style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9' }}>
            <h3>City-wise Details</h3>
          </div>

          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>CITY</th>
                  <th>TOTAL</th>
                  <th>ACTIVE</th>
                  <th>VERIFIED</th>
                </tr>
              </thead>
              <tbody>
                {cityData.map((ct, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{ct.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{ct.state}</div>
                      <div className="dist-progress-track" style={{ width: 100, height: 4, marginTop: 4 }}>
                        <div className="dist-progress-fill orange-gradient" style={{ width: `${(ct.total / 932) * 100}%` }} />
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{ct.total.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: '#16a34a' }}>{ct.active.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{ct.verified.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top 10 Gyms by Revenue & Expiring Subscriptions Row */}
      <div className="analytics-2col-grid">
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="chart-card-header" style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9' }}>
            <h3>Top 10 Gyms by Revenue</h3>
            <span className="subtitle">2026-07-01 → 2026-07-22</span>
          </div>

          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>GYM</th>
                  <th>SUBS</th>
                  <th>REVENUE</th>
                </tr>
              </thead>
              <tbody>
                {topGyms.map((g) => (
                  <tr key={g.rank}>
                    <td>
                      <span className={`rank-circle-badge ${g.rank <= 3 ? 'orange' : 'grey'}`}>
                        {g.rank}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{g.name}</div>
                      <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{g.location}</div>
                    </td>
                    <td>
                      <span className="sub-pill-badge">{g.subs}</span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#16a34a' }}>{g.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Expiring Subscriptions</h3>
            <span className="pill-status-published-lowercase" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
              2 in 30d
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {expiringSubs.map((exp, idx) => (
              <div key={idx} className="expire-item-row">
                <div className="expire-item-left">
                  <div className="expire-icon-circle">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 13.5 }}>{exp.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{exp.location}</div>
                  </div>
                </div>
                <span style={{ fontWeight: 800, color: '#ef4444', fontSize: 14 }}>{exp.days}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
