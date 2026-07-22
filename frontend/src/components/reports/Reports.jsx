import React from 'react';
import {
  Building2,
  CheckCircle2,
  Users,
  Wallet,
  DollarSign,
  Clock,
  Printer,
  FileText,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import './Reports.css';

// Mock Chart Datasets matching user reference images
const revenueData = [
  { month: 'Jan 2026', Invoiced: 0, Collected: 0 },
  { month: 'Feb 2026', Invoiced: 4500, Collected: 2000 },
  { month: 'Mar 2026', Invoiced: 8000, Collected: 4500 },
  { month: 'Apr 2026', Invoiced: 12000, Collected: 6000 },
  { month: 'May 2026', Invoiced: 14500, Collected: 9500 },
  { month: 'Jun 2026', Invoiced: 15817, Collected: 11200 },
  { month: 'Jul 2026', Invoiced: 15817, Collected: 15817 }
];

const gymGrowthData = [
  { month: 'Dec 2025', count: 0 },
  { month: 'Jan 2026', count: 2100 },
  { month: 'Feb 2026', count: 4800 },
  { month: 'Mar 2026', count: 6500 },
  { month: 'Apr 2026', count: 7200 },
  { month: 'May 2026', count: 7900 },
  { month: 'Jun 2026', count: 8300 },
  { month: 'Jul 2026', count: 8500 }
];

const topCitiesData = [
  { city: 'Bengaluru', gyms: 690 },
  { city: 'New Delhi', gyms: 450 },
  { city: 'Hyderabad', gyms: 380 },
  { city: 'Ghaziabad', gyms: 310 },
  { city: 'Mumbai', gyms: 290 },
  { city: 'Delhi', gyms: 260 },
  { city: 'Pune', gyms: 210 },
  { city: 'Gurugram', gyms: 190 },
  { city: 'Kolkata', gyms: 160 },
  { city: 'Nagpur', gyms: 140 }
];

const ownerDistributionState = [
  { state: 'Uttar Pradesh', count: 1 }
];

export default function Reports({ onNavigateToInvoices, onNavigateToGyms, onActionTrigger }) {
  const handlePrint = () => {
    window.print();
    if (onActionTrigger) onActionTrigger('Printed / Exported Reports');
  };

  return (
    <div className="reports-page">
      {/* Top Hero Header */}
      <div className="reports-hero-header">
        <div className="reports-hero-title">
          <h1>Reports & Analytics</h1>
          <p>Platform overview · updated 22 Jul 2026, 22:17</p>
        </div>

        <div className="reports-hero-actions">
          <button
            className="btn-reports-secondary"
            onClick={() => {
              if (onNavigateToInvoices) onNavigateToInvoices();
              if (onActionTrigger) onActionTrigger('Opened Finance Reports');
            }}
          >
            <FileText size={16} />
            <span>Finance Reports</span>
          </button>

          <button className="btn-reports-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print / Export</span>
          </button>
        </div>
      </div>

      {/* 6 Mini Stats Cards Grid */}
      <div className="reports-mini-stats-grid">
        <div className="reports-mini-card">
          <div className="mini-icon-square blue">
            <Building2 size={20} />
          </div>
          <div className="mini-card-info">
            <span className="mini-card-label">Total Gyms</span>
            <span className="mini-card-value">17,835</span>
          </div>
        </div>

        <div className="reports-mini-card">
          <div className="mini-icon-square green">
            <CheckCircle2 size={20} />
          </div>
          <div className="mini-card-info">
            <span className="mini-card-label">Active Gyms</span>
            <span className="mini-card-value">17,835</span>
          </div>
        </div>

        <div className="reports-mini-card">
          <div className="mini-icon-square purple">
            <Users size={20} />
          </div>
          <div className="mini-card-info">
            <span className="mini-card-label">Total Owners</span>
            <span className="mini-card-value">1</span>
          </div>
        </div>

        <div className="reports-mini-card">
          <div className="mini-icon-square orange">
            <Wallet size={20} />
          </div>
          <div className="mini-card-info">
            <span className="mini-card-label">Subscriptions</span>
            <span className="mini-card-value">18</span>
          </div>
        </div>

        <div className="reports-mini-card">
          <div className="mini-icon-square emerald">
            <DollarSign size={20} />
          </div>
          <div className="mini-card-info">
            <span className="mini-card-label">Collected</span>
            <span className="mini-card-value">₹0</span>
          </div>
        </div>

        <div className="reports-mini-card">
          <div className="mini-icon-square red">
            <Clock size={20} />
          </div>
          <div className="mini-card-info">
            <span className="mini-card-label">Pending Dues</span>
            <span className="mini-card-value">₹15,817</span>
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Revenue Trend & Gym Growth */}
      <div className="reports-charts-row-1">
        <div className="reports-card-box">
          <div className="reports-card-header">
            <div>
              <h3>Revenue Trend</h3>
              <p>Invoiced vs Collected (₹)</p>
            </div>
            <button
              className="reports-link-btn"
              onClick={() => {
                if (onNavigateToInvoices) onNavigateToInvoices();
              }}
            >
              <span>View invoices</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Invoiced" stroke="#2563EB" fillOpacity={1} fill="url(#colorInvoiced)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="Collected" stroke="#10B981" fillOpacity={1} fill="url(#colorCollected)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="reports-card-box">
          <div className="reports-card-header">
            <div>
              <h3>Gym Growth</h3>
              <p>Gyms added per month</p>
            </div>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gymGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#F05223" strokeWidth={3} dot={{ r: 4, fill: '#F05223' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Gyms by State, Gym Types, Subscription Status */}
      <div className="reports-charts-row-2">
        {/* Gyms by State */}
        <div className="reports-card-box">
          <div className="reports-card-header">
            <div>
              <h3>Gyms by State</h3>
              <p>Top 10</p>
            </div>
          </div>

          <div className="state-progress-list">
            {[
              { name: 'Uttar Pradesh', count: 3709, max: 3709, color: '#F05223' },
              { name: 'Maharashtra', count: 2508, max: 3709, color: '#2563EB' },
              { name: 'Delhi', count: 1789, max: 3709, color: '#16A34A' },
              { name: 'Haryana', count: 1097, max: 3709, color: '#9333EA' },
              { name: 'Karnataka', count: 998, max: 3709, color: '#DB2777' },
              { name: 'Punjab', count: 934, max: 3709, color: '#0284C7' }
            ].map((st) => (
              <div key={st.name} className="state-progress-item">
                <div className="state-progress-meta">
                  <span className="state-name-text">{st.name}</span>
                  <span className="state-count-text">{st.count.toLocaleString()}</span>
                </div>
                <div className="state-progress-track">
                  <div
                    className="state-progress-fill"
                    style={{
                      width: `${(st.count / st.max) * 100}%`,
                      backgroundColor: st.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gym Types */}
        <div className="reports-card-box">
          <div className="reports-card-header">
            <div>
              <h3>Gym Types</h3>
              <p>Category distribution</p>
            </div>
          </div>

          <div className="types-legend-list">
            {[
              { label: 'Gym', count: '11,590 (65%)', color: '#F05223' },
              { label: 'Fitness center', count: '3,560 (20%)', color: '#2563EB' },
              { label: 'Yoga studio', count: '1,780 (10%)', color: '#16A34A' },
              { label: 'Unisex', count: '535 (3%)', color: '#9333EA' },
              { label: 'Personal trainer', count: '370 (2%)', color: '#DB2777' }
            ].map((tp) => (
              <div key={tp.label} className="type-legend-row">
                <div className="type-dot-group">
                  <span className="type-dot" style={{ backgroundColor: tp.color }} />
                  <span className="type-name-label">{tp.label}</span>
                </div>
                <span className="type-val-badge">{tp.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Status & Approvals */}
        <div className="reports-card-box">
          <div className="reports-card-header">
            <div>
              <h3>Subscription Status</h3>
              <p>Platform status & approvals</p>
            </div>
          </div>

          <div className="approval-status-boxes">
            <div className="approval-box pending">
              <span className="approval-num">4,844</span>
              <span className="approval-lbl">Pending Approval</span>
            </div>

            <div className="approval-box approved">
              <span className="approval-num">12,991</span>
              <span className="approval-lbl">Approved Gyms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Top Cities by Gym Count & Subscription Plans Breakdown */}
      <div className="reports-charts-row-1">
        <div className="reports-card-box">
          <div className="reports-card-header">
            <div>
              <h3>Top Cities by Gym Count</h3>
              <p>Top 10</p>
            </div>
          </div>

          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCitiesData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="city" tick={{ fontSize: 10, fill: '#64748B' }} interval={0} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="gyms" fill="#F05223" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="reports-card-box">
          <div className="reports-card-header">
            <div>
              <h3>Subscription Plans</h3>
              <p>By gym count</p>
            </div>
          </div>

          <div className="state-progress-list" style={{ marginTop: 8 }}>
            {[
              { name: '1 Month Plan', count: 14, max: 14, color: '#F05223' },
              { name: '3 Month Plan', count: 2, max: 14, color: '#2563EB' },
              { name: '1 Year Plan', count: 2, max: 14, color: '#16A34A' }
            ].map((pl) => (
              <div key={pl.name} className="state-progress-item">
                <div className="state-progress-meta">
                  <span className="state-name-text">{pl.name}</span>
                  <span className="state-count-text">{pl.count}</span>
                </div>
                <div className="state-progress-track">
                  <div
                    className="state-progress-fill"
                    style={{
                      width: `${(pl.count / pl.max) * 100}%`,
                      backgroundColor: pl.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Invoice Breakdown Card */}
      <div className="reports-card-box">
        <div className="reports-card-header">
          <div>
            <h3>Invoice Breakdown</h3>
            <p>Total invoiced: ₹15,817.10</p>
          </div>
        </div>

        <div className="invoices-summary-box">
          <div className="invoice-sent-card">
            <span className="invoice-sent-num">4</span>
            <span className="invoice-sent-lbl">Sent</span>
            <span className="invoice-sent-val">₹15,817</span>
          </div>
        </div>
      </div>

      {/* Row 5: 4 Owner Statistics Cards Grid */}
      <div className="owners-stats-grid-4">
        <div className="owner-stat-card purple">
          <span className="owner-stat-title">Total Owners</span>
          <span className="owner-stat-val">1</span>
          <div className="owner-stat-progress-bar">
            <div className="owner-stat-progress-fill purple" />
          </div>
          <span className="owner-stat-subtext">100% of total</span>
        </div>

        <div className="owner-stat-card green">
          <span className="owner-stat-title">Active Owners</span>
          <span className="owner-stat-val">1</span>
          <div className="owner-stat-progress-bar">
            <div className="owner-stat-progress-fill green" />
          </div>
          <span className="owner-stat-subtext">100% of total</span>
        </div>

        <div className="owner-stat-card blue">
          <span className="owner-stat-title">Email Verified</span>
          <span className="owner-stat-val">17,449</span>
          <div className="owner-stat-progress-bar">
            <div className="owner-stat-progress-fill blue" />
          </div>
          <span className="owner-stat-subtext">1744900% of total</span>
        </div>

        <div className="owner-stat-card red">
          <span className="owner-stat-title">Inactive Owners</span>
          <span className="owner-stat-val">0</span>
          <div className="owner-stat-progress-bar">
            <div className="owner-stat-progress-fill red" />
          </div>
          <span className="owner-stat-subtext">0% of total</span>
        </div>
      </div>

      {/* Row 6: Owner Distribution by State */}
      <div className="reports-card-box">
        <div className="reports-card-header">
          <div>
            <h3>Owner Distribution by State</h3>
            <p>Top 10 states</p>
          </div>
        </div>

        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ownerDistributionState} margin={{ top: 20, right: 20, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="state" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 1]} tickCount={2} />
              <Tooltip />
              <Bar dataKey="count" fill="#F05223" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 7: Recently Added Gyms Table */}
      <div className="reports-table-card">
        <div className="reports-table-header">
          <h4>Recently Added Gyms</h4>
          <button
            className="reports-link-btn"
            onClick={() => {
              if (onNavigateToGyms) onNavigateToGyms();
            }}
          >
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="reports-custom-table">
            <thead>
              <tr>
                <th>GYM</th>
                <th>OWNER</th>
                <th>LOCATION</th>
                <th>STATUS</th>
                <th>SUBSCRIPTION</th>
                <th>ADDED</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: '019647',
                  name: 'Health and Fitness Store Guwahati',
                  owner: 'Muscles & Fitness Zone',
                  location: 'Guwahati, Assam',
                  status: 'Active',
                  subscription: 'No Plan',
                  added: '20 Jul 2026',
                  bg: '#DBEAFE',
                  color: '#2563EB',
                  initials: 'HE'
                },
                {
                  id: '019646',
                  name: 'MR. BULL FITNESS',
                  owner: 'MR. BULL FITNESS',
                  location: 'Guwahati, Assam',
                  status: 'Active',
                  subscription: 'No Plan',
                  added: '20 Jul 2026',
                  bg: '#DCFCE7',
                  color: '#16A34A',
                  initials: 'MR'
                },
                {
                  id: '019648',
                  name: 'Gymnastics terminal',
                  owner: 'Gymnastics terminal',
                  location: 'Guwahati, Assam',
                  status: 'Active',
                  subscription: 'No Plan',
                  added: '20 Jul 2026',
                  bg: '#F3E8FF',
                  color: '#9333EA',
                  initials: 'GY'
                },
                {
                  id: '019649',
                  name: "Gold's Gym Ulubari",
                  owner: "Gold's Gym Ulubari",
                  location: 'Guwahati, Assam',
                  status: 'Active',
                  subscription: 'No Plan',
                  added: '20 Jul 2026',
                  bg: '#FCE7F3',
                  color: '#DB2777',
                  initials: 'GO'
                },
                {
                  id: '019778',
                  name: 'Core fitness gym',
                  owner: 'yuvraj',
                  location: 'Moradabad, Uttar Pradesh',
                  status: 'Active',
                  subscription: 'No Plan',
                  added: '22 Jul 2026',
                  bg: '#FFEDD5',
                  color: '#EA580C',
                  initials: 'CO'
                },
                {
                  id: '019777',
                  name: 'Fitness club',
                  owner: 'yuvraj',
                  location: 'Moradabad, Uttar Pradesh',
                  status: 'Active',
                  subscription: 'No Plan',
                  added: '22 Jul 2026',
                  bg: '#DBEAFE',
                  color: '#2563EB',
                  initials: 'FI'
                }
              ].map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="gym-avatar-cell">
                      <div
                        className="gym-avatar-circle"
                        style={{ backgroundColor: row.bg, color: row.color }}
                      >
                        {row.initials}
                      </div>
                      <div>
                        <div className="gym-cell-name">{row.name}</div>
                        <div className="gym-cell-code">{row.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{row.owner}</td>
                  <td>{row.location}</td>
                  <td>
                    <span className="status-badge-pill active">• Active</span>
                  </td>
                  <td>
                    <span className="sub-badge-pill">{row.subscription}</span>
                  </td>
                  <td>{row.added}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-table-view"
                      onClick={() => {
                        if (onNavigateToGyms) onNavigateToGyms();
                      }}
                    >
                      <span>View</span>
                      <ArrowRight size={13} />
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
