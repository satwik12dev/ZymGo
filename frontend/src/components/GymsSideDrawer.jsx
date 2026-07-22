import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import './GymsSideDrawer.css';

export const drawerDataMap = {
  gyms: {
    title: 'Gyms',
    subtitle: '50 records',
    navPath: '/members/gyms',
    items: [
      { id: 1, name: 'Core fitness gym', location: 'Moradabad, Uttar Pradesh', date: '22 Jul 2026', count: 1, initials: 'CO', bg: '#FFEDD5', color: '#EA580C' },
      { id: 2, name: 'Fitness club', location: 'Moradabad, Uttar Pradesh', date: '22 Jul 2026', count: 1, initials: 'FI', bg: '#DBEAFE', color: '#2563EB' },
      { id: 3, name: 'A super power bodybuilding gym', location: 'Dumra, Bihar', date: '21 Jul 2026', count: 1, initials: 'A', bg: '#DCFCE7', color: '#16A34A' },
      { id: 4, name: 'Yoga Centre Boraservice', location: 'Guwahati, Assam', date: '20 Jul 2026', count: 1, initials: 'YO', bg: '#F3E8FF', color: '#9333EA' },
      { id: 5, name: 'Guwahati Yoga Bliss', location: 'Guwahati, Assam', date: '20 Jul 2026', count: 1, initials: 'GU', bg: '#FCE7F3', color: '#DB2777' },
      { id: 6, name: 'Divine Yoga Studio(Bharalumukh)', location: 'Guwahati, Assam', date: '20 Jul 2026', count: 1, initials: 'DI', bg: '#E0F2FE', color: '#0284C7' },
      { id: 7, name: 'Durlav Yoga Centre', location: 'Guwahati, Assam', date: '20 Jul 2026', count: 1, initials: 'DU', bg: '#FFEDD5', color: '#C2410C' },
      { id: 8, name: 'PURVOTTAR YOGA CENTRE', location: 'Guwahati, Assam', date: '20 Jul 2026', count: 1, initials: 'PU', bg: '#E0E7FF', color: '#4F46E5' },
      { id: 9, name: 'Ayush Yoga 24', location: 'Guwahati, Assam', date: '20 Jul 2026', count: 1, initials: 'AY', bg: '#DCFCE7', color: '#15803D' },
      { id: 10, name: "Gold's Gym Super Hub", location: 'Connaught Place, New Delhi', date: '19 Jul 2026', count: 1, initials: 'GO', bg: '#FEF3C7', color: '#D97706' },
      { id: 11, name: 'Cult.fit Performance Studio', location: 'Koramangala, Bengaluru', date: '18 Jul 2026', count: 1, initials: 'CU', bg: '#DBEAFE', color: '#1D4ED8' },
      { id: 12, name: 'Nitro Fitness & Wellness', location: 'Bandra West, Mumbai', date: '17 Jul 2026', count: 1, initials: 'NI', bg: '#FFE4E6', color: '#E11D48' }
    ]
  },
  owners: {
    title: 'Gym Owners',
    subtitle: '12 records',
    navPath: '/members/list',
    items: [
      { id: 1, name: 'Kodexive Gym Admin', location: 'Super Admin · admin@zymgoo.com', date: '22 Jul 2026', count: 'Active', initials: 'KO', bg: '#F3E8FF', color: '#9333EA' },
      { id: 2, name: 'Yuvraj Singh', location: 'Owner · Moradabad, Uttar Pradesh', date: '22 Jul 2026', count: 'Active', initials: 'YU', bg: '#FFEDD5', color: '#EA580C' },
      { id: 3, name: 'Rajesh Kumar', location: 'Owner · Moradabad, Uttar Pradesh', date: '22 Jul 2026', count: 'Active', initials: 'RA', bg: '#DBEAFE', color: '#2563EB' },
      { id: 4, name: 'Amit Sharma', location: 'Owner · Dumra, Bihar', date: '21 Jul 2026', count: 'Active', initials: 'AM', bg: '#DCFCE7', color: '#16A34A' },
      { id: 5, name: 'Priya Patel', location: 'Owner · Guwahati, Assam', date: '20 Jul 2026', count: 'Active', initials: 'PR', bg: '#FCE7F3', color: '#DB2777' },
      { id: 6, name: 'Vikram Rathore', location: 'Owner · Guwahati, Assam', date: '20 Jul 2026', count: 'Active', initials: 'VI', bg: '#E0F2FE', color: '#0284C7' },
      { id: 7, name: 'Sunita Das', location: 'Owner · Guwahati, Assam', date: '20 Jul 2026', count: 'Active', initials: 'SU', bg: '#FFEDD5', color: '#C2410C' },
      { id: 8, name: 'Rahul Verma', location: 'Owner · New Delhi', date: '19 Jul 2026', count: 'Active', initials: 'RV', bg: '#E0E7FF', color: '#4F46E5' }
    ]
  },
  revenue: {
    title: 'Monthly Revenue Transactions',
    subtitle: '15 transactions',
    navPath: '/finance/invoices',
    items: [
      { id: 1, name: 'Kodexive Gym - Yearly Pro Plan', location: 'Invoice #INV-2026-001', date: '22 Jul 2026', count: '₹14,999', initials: 'KO', bg: '#DCFCE7', color: '#15803D' },
      { id: 2, name: 'Core Fitness Gym - Gold Plan', location: 'Invoice #INV-2026-002', date: '22 Jul 2026', count: '₹4,999', initials: 'CO', bg: '#DCFCE7', color: '#15803D' },
      { id: 3, name: "Gold's Gym Hub - Quarterly Pass", location: 'Invoice #INV-2026-003', date: '20 Jul 2026', count: '₹12,500', initials: 'GO', bg: '#DCFCE7', color: '#15803D' },
      { id: 4, name: 'Cult.fit Performance - Enterprise', location: 'Invoice #INV-2026-004', date: '19 Jul 2026', count: '₹25,000', initials: 'CU', bg: '#DCFCE7', color: '#15803D' },
      { id: 5, name: 'Nitro Fitness - Monthly Plan', location: 'Invoice #INV-2026-005', date: '18 Jul 2026', count: '₹2,999', initials: 'NI', bg: '#DCFCE7', color: '#15803D' },
      { id: 6, name: 'Fitness Club - Basic Pass', location: 'Invoice #INV-2026-006', date: '17 Jul 2026', count: '₹1,999', initials: 'FI', bg: '#DCFCE7', color: '#15803D' }
    ]
  },
  dues: {
    title: 'Pending Dues & Invoices',
    subtitle: '8 pending records',
    navPath: '/finance/invoices',
    items: [
      { id: 1, name: 'Fitness Club Moradabad', location: 'Payment Overdue by 3 days', date: '19 Jul 2026', count: '₹3,500 due', initials: 'FI', bg: '#FFE4E6', color: '#E11D48' },
      { id: 2, name: 'Yoga Centre Boraservice', location: 'Payment Overdue by 5 days', date: '17 Jul 2026', count: '₹5,800 due', initials: 'YO', bg: '#FFEDD5', color: '#EA580C' },
      { id: 3, name: 'A Super Power Bodybuilding Gym', location: 'Payment Overdue by 7 days', date: '15 Jul 2026', count: '₹2,200 due', initials: 'AS', bg: '#FFE4E6', color: '#E11D48' },
      { id: 4, name: 'Durlav Yoga Centre', location: 'Payment Overdue by 10 days', date: '12 Jul 2026', count: '₹4,317 due', initials: 'DU', bg: '#FFEDD5', color: '#EA580C' },
      { id: 5, name: 'Ayush Yoga 24', location: 'Payment Overdue by 12 days', date: '10 Jul 2026', count: '₹2,000 due', initials: 'AY', bg: '#FFE4E6', color: '#E11D48' }
    ]
  },
  active_sub: {
    title: 'Active Subscriptions',
    subtitle: '18 active plans',
    navPath: '/members/plans',
    items: [
      { id: 1, name: 'Pro Gold Plan - Kodexive Gym', location: 'Validity: 1 Year (Renews Jul 2027)', date: 'Active', count: '#PRO-01', initials: 'PR', bg: '#DCFCE7', color: '#16A34A' },
      { id: 2, name: "Platinum Gym Suite - Gold's Gym", location: 'Validity: 6 Months (Renews Jan 2027)', date: 'Active', count: '#PLAT-02', initials: 'PL', bg: '#DBEAFE', color: '#2563EB' },
      { id: 3, name: 'Standard Gym Pass - Core Fitness', location: 'Validity: 1 Year (Renews Aug 2027)', date: 'Active', count: '#STD-03', initials: 'ST', bg: '#F3E8FF', color: '#9333EA' },
      { id: 4, name: 'Unlimited Yoga Pass - Guwahati Yoga', location: 'Validity: 3 Months (Renews Oct 2026)', date: 'Active', count: '#YOGA-04', initials: 'UN', bg: '#E0F2FE', color: '#0284C7' },
      { id: 5, name: 'Fitness Pro Bundle - Cult.fit', location: 'Validity: 1 Year (Renews Jun 2027)', date: 'Active', count: '#PRO-05', initials: 'FI', bg: '#E0E7FF', color: '#4F46E5' }
    ]
  },
  expiring_sub: {
    title: 'Expiring Subscriptions (7 days)',
    subtitle: '3 expiring soon',
    navPath: '/members/plans',
    items: [
      { id: 1, name: 'Standard Plan - Fitness Club', location: 'Expires in 2 days (24 Jul 2026)', date: 'Action Needed', count: '#STD-88', initials: 'FI', bg: '#FEF3C7', color: '#D97706' },
      { id: 2, name: 'Gold Plan - Yoga Centre Boraservice', location: 'Expires in 4 days (26 Jul 2026)', date: 'Action Needed', count: '#GOLD-92', initials: 'GO', bg: '#FEF3C7', color: '#D97706' },
      { id: 3, name: 'Starter Pass - Divine Yoga Studio', location: 'Expires in 6 days (28 Jul 2026)', date: 'Action Needed', count: '#START-95', initials: 'ST', bg: '#FEF3C7', color: '#D97706' }
    ]
  },
  inactive_owners: {
    title: 'Inactive Owners',
    subtitle: '4 inactive records',
    navPath: '/members/list',
    items: [
      { id: 1, name: 'Suresh Verma', location: 'Status: Pending Verification', date: 'Inactive 15d', count: 'Unverified', initials: 'SU', bg: '#F1F5F9', color: '#64748B' },
      { id: 2, name: 'Rohan Gupta', location: 'Status: Subscription Suspended', date: 'Inactive 30d', count: 'Suspended', initials: 'RO', bg: '#F1F5F9', color: '#64748B' },
      { id: 3, name: 'Meena Kumari', location: 'Status: Unverified Phone', date: 'Inactive 45d', count: 'Pending', initials: 'ME', bg: '#F1F5F9', color: '#64748B' },
      { id: 4, name: 'Deepak Chawla', location: 'Status: Account Closed', date: 'Inactive 60d', count: 'Closed', initials: 'DE', bg: '#F1F5F9', color: '#64748B' }
    ]
  }
};

export default function GymsSideDrawer({ isOpen, type = 'gyms', onClose, onViewAll, onSelectGym }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentConfig = drawerDataMap[type] || drawerDataMap.gyms;
  const listItems = currentConfig.items || [];

  const filteredItems = listItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Side Panel Drawer */}
      <div className="drawer-panel">
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-header-left">
            <h3>{currentConfig.title}</h3>
            <p>{currentConfig.subtitle}</p>
          </div>

          <div className="drawer-header-actions">
            <button
              className="btn-view-all-link"
              onClick={() => {
                onClose();
                if (onViewAll) onViewAll(currentConfig.navPath);
              }}
            >
              <span>View all</span>
              <ArrowRight size={14} />
            </button>

            <button
              className="drawer-close-btn"
              onClick={onClose}
              title="Close Panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Input Search */}
        <div className="drawer-search-box">
          <div className="drawer-search-wrapper">
            <Search size={16} className="drawer-search-icon" />
            <input
              type="text"
              className="drawer-search-input"
              placeholder="Filter list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="drawer-body-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="drawer-gym-item"
                onClick={() => {
                  onClose();
                  if (onSelectGym) onSelectGym(item, currentConfig.navPath);
                }}
              >
                <div className="drawer-gym-left">
                  <div
                    className="gym-initials-avatar"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    {item.initials}
                  </div>
                  <div className="gym-info-group">
                    <span className="gym-name-text">{item.name}</span>
                    <span className="gym-location-text">{item.location}</span>
                  </div>
                </div>

                <div className="drawer-gym-right">
                  <span className="gym-count-badge">{item.count}</span>
                  <span className="gym-date-text">{item.date}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="drawer-empty-state">
              No records matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </>
  );
}
