import React from 'react';
import { DollarSign, Calendar, Check, ArrowRight } from 'lucide-react';

export default function DashboardGrids({ onViewAll }) {
  const recentPayments = [
    { id: 1, title: 'N/A', invoice: '#INV-2026-0004', date: '29 Apr 2026', amount: '₹0.00', status: 'Sent' },
    { id: 2, title: 'N/A', invoice: '#INV-2026-0003', date: '13 Jan 2026', amount: '₹0.00', status: 'Sent' },
    { id: 3, title: 'N/A', invoice: '#INV-2026-0002', date: '13 Jan 2026', amount: '₹0.00', status: 'Sent' },
    { id: 4, title: 'N/A', invoice: '#INV-2026-0001', date: '13 Jan 2026', amount: '₹0.00', status: 'Sent' },
  ];

  const expiringSubscriptions = [
    { id: 1, name: 'N/A', plan: '1 Month Plan', expDate: 'Exp 25 Jul 2026', daysLeft: '3d', urgent: true },
    { id: 2, name: 'Testing Gym', plan: '1 Month Plan', expDate: 'Exp 25 Jul 2026', daysLeft: '3d', urgent: true },
    { id: 3, name: 'MD Fitness Gym', plan: '1 Month Plan', expDate: 'Exp 27 Jul 2026', daysLeft: '5d', urgent: true },
    { id: 4, name: 'Fitness point', plan: '1 Month Plan', expDate: 'Exp 15 Aug 2026', daysLeft: '24d', urgent: false },
  ];

  const recentGymOwners = [
    { id: 1, initials: 'RA', name: 'Raja ali', phoneLocation: '7352132557 · Dumra', verified: false, color: 'orange' },
    { id: 2, initials: 'YO', name: 'Yog Chetna', phoneLocation: '9508251830 · Jamshedpur', verified: true, color: 'blue' },
    { id: 3, initials: 'NO', name: 'Nourish And Wellness Nutrition C...', phoneLocation: '9031336180 · Jamshedpur', verified: true, color: 'green' },
    { id: 4, initials: 'IN', name: 'Inspirational Yoga', phoneLocation: '7209339704 · Jamshedpur', verified: true, color: 'purple' },
    { id: 5, initials: 'SH', name: 'Shree Vyas Yoga Classes', phoneLocation: '7667953047 · Jamshedpur', verified: true, color: 'pink' },
  ];

  return (
    <div className="tables-grid-2x2">
      {/* 1. Recent Payments */}
      <div className="grid-table-card">
        <div className="table-header">
          <div className="header-left-group">
            <h3>Recent Payments</h3>
          </div>
          <button className="card-link" onClick={() => onViewAll('Recent Payments')}>
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="data-list">
          {recentPayments.map((item) => (
            <div key={item.id} className="data-item">
              <div className="item-left">
                <div className="item-icon-circle green">
                  <DollarSign size={18} />
                </div>
                <div className="item-text">
                  <h4>{item.title}</h4>
                  <p>{item.invoice} · {item.date}</p>
                </div>
              </div>
              <div className="item-right">
                <span className="amount-text">{item.amount}</span>
                <span className="status-tag sent">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Expiring Subscriptions */}
      <div className="grid-table-card">
        <div className="table-header">
          <div className="header-left-group">
            <h3>Expiring Subscriptions</h3>
            <span className="pill-count-badge">3 in 7d</span>
          </div>
          <button className="card-link" onClick={() => onViewAll('Expiring Subscriptions')}>
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="data-list">
          {expiringSubscriptions.map((item) => (
            <div key={item.id} className="data-item">
              <div className="item-left">
                <div className={`item-icon-circle ${item.urgent ? 'red-light' : 'yellow-light'}`}>
                  <Calendar size={18} />
                </div>
                <div className="item-text">
                  <h4>{item.name}</h4>
                  <p>{item.plan} · {item.expDate}</p>
                </div>
              </div>
              <div className="item-right">
                <span className={item.urgent ? 'days-left-red' : 'days-left-yellow'}>
                  {item.daysLeft}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Gym Owners */}
      <div className="grid-table-card">
        <div className="table-header">
          <div className="header-left-group">
            <h3>Recent Gym Owners</h3>
          </div>
          <button className="card-link" onClick={() => onViewAll('Recent Gym Owners')}>
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="data-list">
          {recentGymOwners.map((owner) => (
            <div key={owner.id} className="data-item">
              <div className="item-left">
                <div className={`item-avatar-initials ${owner.color}`}>
                  {owner.initials}
                </div>
                <div className="item-text">
                  <h4>{owner.name}</h4>
                  <p>{owner.phoneLocation}</p>
                </div>
              </div>
              <div className="item-right">
                <span className={`status-tag ${owner.verified ? 'verified' : 'unverified'}`}>
                  {owner.verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Inactive Owners (Empty State) */}
      <div className="grid-table-card">
        <div className="table-header">
          <div className="header-left-group">
            <h3>Inactive Owners</h3>
          </div>
          <button className="card-link" onClick={() => onViewAll('Inactive Owners')}>
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="empty-state-box">
          <div className="empty-circle-check">
            <Check size={24} />
          </div>
          <p>All owners are active</p>
        </div>
      </div>
    </div>
  );
}
