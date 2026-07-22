import React from 'react';
import { 
  Building, 
  Users, 
  DollarSign, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  TrendingDown 
} from 'lucide-react';

export default function StatCards({ onCardClick }) {
  const topStats = [
    {
      id: 'gyms',
      label: 'Total Gyms',
      value: '17,866',
      badgeText: '17,866 active · 0 inactive',
      colorClass: 'blue',
      icon: Building
    },
    {
      id: 'owners',
      label: 'Total Owners',
      value: '1',
      badgeText: '1 active',
      colorClass: 'purple',
      icon: Users
    },
    {
      id: 'revenue',
      label: 'Monthly Revenue',
      value: '₹0',
      badgeText: 'Today ₹0',
      colorClass: 'green',
      icon: DollarSign
    },
    {
      id: 'dues',
      label: 'Pending Dues',
      value: '₹15,817',
      badgeText: 'Action required',
      colorClass: 'orange',
      icon: Clock
    }
  ];

  const bottomStats = [
    {
      id: 'active_sub',
      label: 'Active Subscriptions',
      value: '18',
      iconColor: 'green',
      borderClass: 'border-green',
      icon: CheckCircle
    },
    {
      id: 'expiring_sub',
      label: 'Expiring (7 days)',
      value: '3',
      iconColor: 'yellow',
      borderClass: 'border-yellow',
      icon: AlertTriangle
    },
    {
      id: 'inactive_owners',
      label: 'Inactive Owners',
      value: '0',
      iconColor: 'red',
      borderClass: 'border-red',
      icon: TrendingDown
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top 4 Cards Row */}
      <div className="stat-cards-row-1">
        {topStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.id} 
              className="stat-card"
              onClick={() => onCardClick(stat.label)}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-icon-wrapper className flex">
                <div className={`stat-icon-wrapper ${stat.colorClass}`}>
                  <Icon size={22} />
                </div>
              </div>
              <ChevronRight size={18} className="card-chevron" />
              <span className="stat-card-label">{stat.label}</span>
              <h3 className="stat-card-value">{stat.value}</h3>
              <div className={`stat-badge ${stat.colorClass}`}>
                {stat.badgeText}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom 3 Wide Cards Row */}
      <div className="stat-cards-row-2">
        {bottomStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.id} 
              className={`stat-card-wide ${stat.borderClass}`}
              onClick={() => onCardClick(stat.label)}
              style={{ cursor: 'pointer' }}
            >
              <div className="wide-left">
                <div className={`circle-icon ${stat.iconColor}`}>
                  <Icon size={24} />
                </div>
                <div className="wide-info">
                  <span>{stat.label}</span>
                  <h3>{stat.value}</h3>
                </div>
              </div>
              <ChevronRight size={18} className="card-chevron" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
