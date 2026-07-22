import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import './OnboardingPerformance.css';

export default function OnboardingPerformance({ onActionTrigger }) {
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-07-22');
  const [salesPerson, setSalesPerson] = useState('All');
  const [isFiltered, setIsFiltered] = useState(false);

  const handleApply = () => {
    setIsFiltered(true);
    if (onActionTrigger) onActionTrigger(`Applied onboarding filters from ${fromDate} to ${toDate} for ${salesPerson}`);
  };

  const handleReset = () => {
    setFromDate('2026-07-01');
    setToDate('2026-07-22');
    setSalesPerson('All');
    setIsFiltered(false);
    if (onActionTrigger) onActionTrigger('Reset onboarding performance filters');
  };

  return (
    <div className="onboarding-performance-page">
      {/* Header */}
      <div className="onboarding-header">
        <h1>Onboarding Performance</h1>
        <p>Wednesday, July 22, 2026</p>
      </div>

      {/* Dark Orange Hero Banner Card */}
      <div className="onboarding-hero-banner">
        <h2>Sales/Employee Onboarding Performance</h2>
        <p>Track which gyms were onboarded by which team member.</p>
      </div>

      {/* Filter Card */}
      <div className="onboarding-filter-card">
        <div className="filter-input-group">
          <label>From</label>
          <div className="filter-date-wrapper">
            <input 
              type="date" 
              className="filter-date-input" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <Calendar size={16} className="filter-calendar-icon" />
          </div>
        </div>

        <div className="filter-input-group">
          <label>To</label>
          <div className="filter-date-wrapper">
            <input 
              type="date" 
              className="filter-date-input" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <Calendar size={16} className="filter-calendar-icon" />
          </div>
        </div>

        <div className="filter-input-group">
          <label>Sales Person</label>
          <select 
            className="filter-select-input"
            value={salesPerson}
            onChange={(e) => setSalesPerson(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Rahul Sharma">Rahul Sharma</option>
            <option value="Priya Patel">Priya Patel</option>
            <option value="Amit Kumar">Amit Kumar</option>
            <option value="Vikram Singh">Vikram Singh</option>
          </select>
        </div>

        <div className="filter-actions-group">
          <button className="btn-filter-apply" onClick={handleApply}>
            Apply
          </button>
          <button className="btn-filter-reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* 3 Metric Stat Cards Row */}
      <div className="onboarding-stats-grid">
        <div className="onboarding-stat-card">
          <span className="onboarding-stat-label">Total Onboarded Gyms</span>
          <span className="onboarding-stat-num">{isFiltered ? 0 : 0}</span>
        </div>

        <div className="onboarding-stat-card">
          <span className="onboarding-stat-label">Active Gyms</span>
          <span className="onboarding-stat-num green">{isFiltered ? 0 : 0}</span>
        </div>

        <div className="onboarding-stat-card">
          <span className="onboarding-stat-label">With Active Subscription</span>
          <span className="onboarding-stat-num blue">{isFiltered ? 0 : 0}</span>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="onboarding-table-card">
        <div className="onboarding-table-header">
          <h3>Leaderboard</h3>
        </div>

        <div className="table-responsive">
          <table className="onboarding-custom-table">
            <thead>
              <tr>
                <th>Sales Person</th>
                <th>Onboarded Gyms</th>
                <th>Active Subscriptions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className="onboarding-empty-row">
                  No onboarding data found for selected filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboarding Details Table Card */}
      <div className="onboarding-table-card">
        <div className="onboarding-table-header">
          <h3>Onboarding Details</h3>
        </div>

        <div className="table-responsive">
          <table className="onboarding-custom-table">
            <thead>
              <tr>
                <th>Assigned On</th>
                <th>Gym</th>
                <th>Owner</th>
                <th>Sales Person</th>
                <th>Location</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="onboarding-empty-row">
                  No rows found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
