import React, { useState } from 'react';
import { RefreshCw, Play, Filter } from 'lucide-react';
import './AdvanceReports.css';

export default function AdvanceReports({ onActionTrigger }) {
  const [fromDate, setFromDate] = useState('2026-02-01');
  const [toDate, setToDate] = useState('2026-07-31');
  const [isRunningDunning, setIsRunningDunning] = useState(false);

  const notify = (msg) => {
    if (onActionTrigger) onActionTrigger(msg);
  };

  const handleApplyFilter = () => {
    notify(`Applied date range filter: ${fromDate} to ${toDate}`);
  };

  const handleResetFilter = () => {
    setFromDate('2026-02-01');
    setToDate('2026-07-31');
    notify('Reset date range filters');
  };

  const handleRunRenewalDunning = () => {
    setIsRunningDunning(true);
    setTimeout(() => {
      setIsRunningDunning(false);
      notify('Renewal + Dunning automation process completed successfully!');
    }, 1500);
  };

  return (
    <div className="advance-reports-page">
      {/* Header Bar */}
      <div className="reports-header-row">
        <div className="reports-title-group">
          <h1>Advanced Finance Reports</h1>
          <p>Revenue trend, paid vs unpaid trend, gym-wise recovery report</p>
        </div>

        <button 
          className="btn-run-dunning-navy" 
          onClick={handleRunRenewalDunning}
          disabled={isRunningDunning}
        >
          {isRunningDunning ? 'Running Automation...' : 'Run Renewal + Dunning Now'}
        </button>
      </div>

      {/* Date Filter Card */}
      <div className="reports-date-filter-card">
        <div className="reports-filter-input-group">
          <label>From Date</label>
          <input 
            type="date" 
            className="reports-date-input" 
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="reports-filter-input-group">
          <label>To Date</label>
          <input 
            type="date" 
            className="reports-date-input" 
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button className="btn-apply-orange" onClick={handleApplyFilter}>
          Apply
        </button>

        <button className="btn-reset-grey" onClick={handleResetFilter}>
          Reset
        </button>
      </div>

      {/* 4 Banner Stat Cards Grid */}
      <div className="reports-stats-grid-4">
        <div className="reports-stat-box-item">
          <span className="lbl">Collected Revenue</span>
          <span className="val green">Rs 0.00</span>
        </div>

        <div className="reports-stat-box-item">
          <span className="lbl">Paid Invoices</span>
          <span className="val dark">0</span>
        </div>

        <div className="reports-stat-box-item">
          <span className="lbl">Unpaid Invoices</span>
          <span className="val red">1</span>
        </div>

        <div className="reports-stat-box-item">
          <span className="lbl">Outstanding Amount</span>
          <span className="val orange">Rs 1,178.82</span>
        </div>
      </div>

      {/* Monthly Revenue Trend Card */}
      <div className="reports-section-card">
        <div className="reports-card-header">
          <h3>Monthly Revenue Trend</h3>
        </div>

        <div className="table-responsive">
          <table className="reports-custom-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Payments</th>
                <th>Collected Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className="reports-empty-msg-td">
                  No monthly revenue data found for selected range.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Gym-Wise Recovery Report Card */}
      <div className="reports-section-card">
        <div className="reports-card-header">
          <h3>Gym-Wise Recovery Report</h3>
        </div>

        <div className="table-responsive">
          <table className="reports-custom-table">
            <thead>
              <tr>
                <th>Gym</th>
                <th>Invoices</th>
                <th>Billed</th>
                <th>Collected</th>
                <th>Outstanding</th>
                <th>Recovery %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>000008</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>000008</div>
                </td>
                <td style={{ fontWeight: 600 }}>1</td>
                <td style={{ fontWeight: 600 }}>Rs 1,178.82</td>
                <td style={{ fontWeight: 700, color: '#16a34a' }}>Rs 0.00</td>
                <td style={{ fontWeight: 700, color: '#ea580c' }}>Rs 1,178.82</td>
                <td>
                  <span className="recovery-pill-red">0.0%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Automation Events Card */}
      <div className="reports-section-card">
        <div className="reports-card-header">
          <h3>Recent Automation Events</h3>
        </div>

        <div className="table-responsive">
          <table className="reports-custom-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Stage</th>
                <th>Entity</th>
                <th>Email</th>
                <th>WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="reports-empty-msg-td">
                  No automation events found yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
