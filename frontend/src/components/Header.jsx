import React from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';

export default function Header({ onNotificationClick, onProfileClick, onToggleSidebar }) {
  return (
    <header className="app-header">
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="mobile-menu-btn" onClick={onToggleSidebar} title="Toggle Navigation Menu">
          <Menu size={22} />
        </button>
        <div>
          <h1>Dashboard</h1>
          <p>Wednesday, July 22, 2026</p>
        </div>
      </div>

      <div className="header-right">
        <button 
          className="notification-btn" 
          onClick={onNotificationClick}
          title="Notifications"
        >
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-dropdown" onClick={onProfileClick}>
          <div className="user-avatar-purple">KO</div>
          <div className="user-info">
            <span className="user-name">Kodexive Gym</span>
            <span className="user-role">Super Admin</span>
          </div>
          <ChevronDown size={16} className="dropdown-chevron" />
        </div>
      </div>
    </header>
  );
}
