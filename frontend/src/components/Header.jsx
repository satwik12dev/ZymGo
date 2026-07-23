import React from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';

const Header = React.memo(function Header({ title, currentUser, onNotificationClick, onProfileClick, onToggleSidebar }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const userName = currentUser?.name || currentUser?.username || 'Kodexive Gym';
  const userRole = currentUser?.role_name || currentUser?.role || 'Super Admin';
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'KO';

  return (
    <header className="app-header">
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="mobile-menu-btn" onClick={onToggleSidebar} title="Toggle Navigation Menu">
          <Menu size={22} />
        </button>
        <div>
          <h1>{title || 'Dashboard'}</h1>
          <p>{currentDate}</p>
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
          <div className="user-avatar-purple">{initials}</div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>
          <ChevronDown size={16} className="dropdown-chevron" />
        </div>
      </div>
    </header>
  );
});

export default Header;
