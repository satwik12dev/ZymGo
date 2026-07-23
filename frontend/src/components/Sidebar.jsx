import React, { useState, useMemo, useCallback } from 'react';
import {
  Zap,
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  Newspaper,
  BarChart3,
  ClipboardList,
  ShieldCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  MoreVertical,
  LogOut,
  Building2,
  UserCheck,
  ArrowUp
} from 'lucide-react';

export const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Members",
    icon: Users,
    children: [
      { title: "Member List", path: "/members/list" },
      { title: "Add Member", path: "/members/add" },
      { title: "Gym List", path: "/members/gyms" },
      { title: "Add Gym", path: "/members/gyms/add" },
      { title: "City Report", path: "/members/city-report" },
      { title: "Onboarding Performance", path: "/members/performance" },
      { title: "Bulk Upload Members", path: "/members/bulk-upload" },
      { title: "Bulk Upload Gym", path: "/members/bulk-upload-gym" },
      { title: "Subscription Plans", path: "/members/plans" },
      { title: "Subscription Audit", path: "/members/audit" },
    ],
  },
  {
    title: "Finance",
    icon: Wallet,
    children: [
      { title: "Invoices", path: "/finance/invoices" },
      { title: "Advance Reports", path: "/finance/reports" },
      { title: "Payments", path: "/finance/payments" },
      { title: "Campaigns", path: "/finance/campaigns" },
    ],
  },
  {
    title: "Content",
    icon: ArrowUp,
    children: [
      { title: "Banners", isHeader: true },
      { title: "Add Banner", path: "/content/banner/add" },
      { title: "All Banners", path: "/content/banner/all" },
      { title: "Update Banner", path: "/content/banner/update" },
      { title: "Categories", isHeader: true },
      { title: "Add Category", path: "/content/category/add" },
      { title: "All Categories", path: "/content/category/all" },
      { title: "Add Sub Category", path: "/content/subcategory/add" },
      { title: "All Sub Categories", path: "/content/subcategory/all" },
    ],
  },
  {
    title: "Blog Management",
    icon: Newspaper,
    children: [
      { title: "All Blogs", path: "/blogs" },
      { title: "Add New Blog", path: "/blogs/add" },
    ],
  },
  {
    title: "Gym Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Reports",
    icon: ClipboardList,
    path: "/reports",
  },
  {
    title: "Administration",
    icon: ShieldCheck,
    children: [
      { title: "Users", path: "/administration/users" },
      {
        title: "Roles & Permissions",
        path: "/administration/roles&permissions",
      },
      {
        title: "Audit Trail",
        path: "/administration/audittrail",
      },
      {
        title: "Version",
        path: "/administration/version",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      {
        title: "Email Settings",
        path: "/settings/emailSettings",
      },
      {
        title: "Communication Settings",
        path: "/settings/communicationSettings",
      },
      {
        title: "Email Templates",
        path: "/settings/template",
      },
      {
        title: "Email Logs",
        path: "/settings/logs",
      },
    ],
  },
];

const Sidebar = React.memo(function Sidebar({
  activeNav,
  setActiveNav,
  onActionTrigger,
  onSignOut,
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;

  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Keep track of which parent accordion sections are expanded
  const [openSubmenu, setOpenSubmenu] = useState({
    Members: false,
    Finance: false,
    Content: false,
    'Blog Management': false,
    Administration: false,
    Settings: false
  });

  const toggleSubmenu = useCallback((title) => {
    setOpenSubmenu((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []);

  const filteredMenuItems = useMemo(() => {
    if (!searchQuery) return menuItems;
    const query = searchQuery.toLowerCase();
    return menuItems.filter(item => {
      const matchesMain = item.title.toLowerCase().includes(query);
      const matchesSub = item.children?.some(child => child.title.toLowerCase().includes(query));
      return matchesMain || matchesSub;
    });
  }, [searchQuery]);

  const handleParentClick = useCallback((item) => {
    if (item.children) {
      if (isCollapsed) setIsCollapsed(false);
      toggleSubmenu(item.title);
      if (item.title === "Members") {
        setActiveNav("/members/list");
      } else if (item.title === "Finance") {
        setActiveNav("/finance/invoices");
      } else if (item.title === "Content") {
        setActiveNav("/content/banner/add");
      }
    } else if (item.path) {
      setActiveNav(item.path);
      if (setIsMobileOpen) setIsMobileOpen(false);
    }
    if (onActionTrigger) onActionTrigger(`Navigated to ${item.title}`);
  }, [isCollapsed, setIsCollapsed, toggleSubmenu, setActiveNav, setIsMobileOpen, onActionTrigger]);

  const handleChildClick = useCallback((parentItem, child) => {
    setActiveNav(child.path);
    if (setIsMobileOpen) setIsMobileOpen(false);
    if (onActionTrigger) onActionTrigger(`Navigated to ${child.title}`);
  }, [setActiveNav, setIsMobileOpen, onActionTrigger]);

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Logo Header */}
      <div className="sidebar-logo">
        <div className="logo-main-group">
          <div className="logo-icon-container">
            <Zap size={22} fill="currentColor" strokeWidth={0} />
          </div>
          <div className="logo-text-wrapper">
            <h2>Zymgoo CRM</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <button
          className="sidebar-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu Search Input */}
      {!isCollapsed && (
        <div className="sidebar-search-container">
          <div className="sidebar-search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Sidebar Navigation Items */}
      <nav className="sidebar-nav">
        {filteredMenuItems.map((item) => {
          const IconComponent = item.icon;

          // Check if parent or one of its children is active
          const isChildActive = item.children?.some(c => c.path === activeNav);
          const isParentActive = item.path === activeNav || isChildActive || (item.title === "Members" && activeNav?.startsWith('/members')) || (item.title === "Content" && activeNav?.startsWith('/content'));
          const isExpanded = openSubmenu[item.title] || (searchQuery.length > 0 && item.children);

          return (
            <div key={item.title}>
              <button
                className={`nav-item-btn ${isParentActive ? 'active' : ''}`}
                onClick={() => handleParentClick(item)}
                title={isCollapsed ? item.title : undefined}
              >
                <div className="nav-left">
                  <IconComponent size={18} />
                  <span>{item.title}</span>
                </div>

                <div className="nav-right-group">
                  {item.children && (
                    isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />
                  )}
                </div>
              </button>

              {/* Children Accordion Submenu */}
              {!isCollapsed && item.children && isExpanded && (
                <div className="submenu-list">
                  {item.children.map((child, cIdx) => {
                    if (child.isHeader) {
                      return (
                        <div key={cIdx} className="submenu-section-header">
                          {child.title}
                        </div>
                      );
                    }

                    const isSelected = activeNav === child.path || (child.path === "/members/list" && (activeNav === "members" || activeNav === "/members/list"));

                    return (
                      <button
                        key={child.path}
                        className={`submenu-item-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => handleChildClick(item, child)}
                      >
                        <span>{child.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer User Info */}
      <div
        className="sidebar-footer"
        onClick={() => setShowUserMenu(!showUserMenu)}
      >
        <div className="footer-user-group">
          <div className="avatar-orange-wrapper">
            <div className="avatar-orange">KO</div>
            <span className="online-dot"></span>
          </div>

          <div className="footer-info">
            <h4>Kodexive Gym</h4>
            <p>Super Admin</p>
          </div>
        </div>

        <MoreVertical size={16} className="footer-more-icon" />

        {/* User Popover Menu */}
        {showUserMenu && !isCollapsed && (
          <div className="user-menu-popover" onClick={(e) => e.stopPropagation()}>
            <div className="popover-header" style={{ marginTop: 6 }}>Account</div>
            <button className="popover-item" onClick={() => { onActionTrigger('Opened Profile Settings'); setShowUserMenu(false); }}>
              <UserCheck size={15} />
              <span onClick={() => setActiveNav("/administration/users")}>Profile Settings</span>
            </button>
            <button className="popover-item danger" onClick={() => {
              setShowUserMenu(false);
              if (onSignOut) {
                onSignOut();
              } else {
                onActionTrigger('Logged out successfully');
              }
            }}>
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
});

export default Sidebar;
