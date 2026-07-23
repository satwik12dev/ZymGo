import React from 'react';
import {
  Plus,
  Building,
  UserPlus,
  Users,
  FileText,
  BookOpen,
  BarChart2,
  CreditCard,
  FileSpreadsheet,
  UserIcon,
  ClipboardList,
  Upload
} from 'lucide-react';

const QuickActions = React.memo(function QuickActions({ onActionClick }) {
  const actions = [
    { id: 'add_gym', label: 'Add Gym', icon: Plus, colorClass: 'qa-add-gym' },
    { id: 'all_gyms', label: 'All Gyms', icon: Building, colorClass: 'qa-all-gyms' },
    { id: 'add_owner', label: 'Add Owner', icon: UserPlus, colorClass: 'qa-add-owner' },
    { id: 'all_owners', label: 'All Owners', icon: Users, colorClass: 'qa-all-owners' },
    { id: 'invoices', label: 'Invoices', icon: FileText, colorClass: 'qa-invoices' },
    { id: 'blog_posts', label: 'Blog Posts', icon: BookOpen, colorClass: 'qa-blog' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, colorClass: 'qa-analytics' },
    { id: 'plans', label: 'Plans', icon: CreditCard, colorClass: 'qa-plans' },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet, colorClass: 'qa-reports' },
    { id: 'users', label: 'Users', icon: UserIcon, colorClass: 'qa-users' },
    { id: 'audit_log', label: 'Audit Log', icon: ClipboardList, colorClass: 'qa-audit' },
    { id: 'bulk_upload', label: 'Bulk Upload', icon: Upload, colorClass: 'qa-bulk' },
  ];

  return (
    <div id="quick-actions" className="quick-actions-card">
      <h3>Quick Actions</h3>

      <div className="actions-grid">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className={`action-item-btn ${action.colorClass}`}
              onClick={() => onActionClick(action)}
            >
              <Icon size={20} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default QuickActions;
