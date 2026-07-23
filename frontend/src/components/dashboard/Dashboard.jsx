import React, { useState, useEffect } from 'react';
import GreetingHeader from '../GreetingHeader';
import StatCards from '../StatCards';
import QuickActions from '../QuickActions';
import AnalyticsCharts from '../AnalyticsCharts';
import DashboardGrids from '../DashboardGrids';
import api from '../../services/api';

export default function Dashboard({ onNavigate, onCardClick, onActionTrigger }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      try {
        // Fetch real user & metrics directly from /admin/dashboard
        const res = await api.auth.getDashboard();
        if (res.user || res.data) {
          const user = res.user || res.data;
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }

        if (res.stats) {
          setDashboardStats(res.stats);
        } else {
          // Fallback fetch reports endpoint
          const reportRes = await api.reports.getStats();
          if (reportRes.data) {
            setDashboardStats(reportRes.data);
          }
        }
      } catch (err) {
        console.warn('[Dashboard] API fetch error:', err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleQuickAction = (action) => {
    const id = action.id;
    if (id === 'add_gym') {
      onNavigate('/members/gyms/add');
    } else if (id === 'all_gyms') {
      onNavigate('/members/gyms');
    } else if (id === 'add_owner') {
      onNavigate('/members/add');
    } else if (id === 'all_owners') {
      onNavigate('/members/list');
    } else if (id === 'invoices') {
      onNavigate('/finance/invoices');
    } else if (id === 'blog_posts') {
      onNavigate('/blogs');
    } else if (id === 'analytics') {
      onNavigate('/analytics');
    } else if (id === 'plans') {
      onNavigate('/members/plans');
    } else if (id === 'reports') {
      onNavigate('/finance/reports');
    } else if (id === 'audit_log') {
      onNavigate('/members/audit');
    } else if (id === 'bulk_upload') {
      onNavigate('/members/bulk-upload');
    } else if (id === 'users') {
      onNavigate('/administration/users');
    }
    if (onActionTrigger) onActionTrigger(`Opened ${action.label}`);
  };

  const handleViewAll = (sectionTitle) => {
    const title = (sectionTitle || '').toLowerCase();
    if (title.includes('invoice')) {
      onNavigate('/finance/invoices');
    } else if (title.includes('payment')) {
      onNavigate('/finance/payments');
    } else if (title.includes('gym')) {
      onNavigate('/members/gyms');
    } else if (title.includes('owner') || title.includes('member')) {
      onNavigate('/members/list');
    } else {
      onNavigate('/members/gyms');
    }
    if (onActionTrigger) onActionTrigger(`View all ${sectionTitle}`);
  };

  return (
    <div className="dashboard-page">
      {/* Greeting & Action Header */}
      <GreetingHeader
        currentUser={currentUser}
        onOpenAddGym={() => onNavigate('/members/gyms/add')}
        onOpenAddOwner={() => onNavigate('/members/add')}
      />

      {/* Metric Cards */}
      <StatCards statsData={dashboardStats} onCardClick={onCardClick} />

      {/* Quick Actions Grid */}
      <QuickActions onActionClick={handleQuickAction} />

      {/* Revenue Trend & Subscriptions Charts */}
      <AnalyticsCharts onViewInvoices={() => handleViewAll('Invoices')} />

      {/* 2x2 Tables Grid */}
      <DashboardGrids onViewAll={handleViewAll} />
    </div>
  );
}
