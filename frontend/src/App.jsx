import React, { useState, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GreetingHeader from './components/GreetingHeader';
import StatCards from './components/StatCards';
import AnalyticsCharts from './components/AnalyticsCharts';
import QuickActions from './components/QuickActions';
import DashboardGrids from './components/DashboardGrids';
import Login from './components/auth/Login';
import GymsSideDrawer from './components/GymsSideDrawer';
import { AddGymModal, AddOwnerModal, InfoModal } from './components/Modals';
import { CheckCircle2 } from 'lucide-react';

// Lazy loaded views for instant page load & code splitting
const Member = lazy(() => import('./components/member/Member'));
const AddMember = lazy(() => import('./components/member/AddMember'));
const GymList = lazy(() => import('./components/member/GymList'));
const GymDetail = lazy(() => import('./components/member/GymDetail'));
const MemberDetail = lazy(() => import('./components/member/MemberDetail'));
const CityReport = lazy(() => import('./components/member/CityReport'));
const OnboardingPerformance = lazy(() => import('./components/member/OnboardingPerformance'));
const BulkUploadGym = lazy(() => import('./components/member/BulkUploadGym'));
const SubscriptionPlans = lazy(() => import('./components/member/SubscriptionPlans'));
const SubscriptionAudit = lazy(() => import('./components/member/SubscriptionAudit'));
const Invoices = lazy(() => import('./components/finance/Invoices'));
const AdvanceReports = lazy(() => import('./components/finance/AdvanceReports'));
const Payments = lazy(() => import('./components/finance/Payments'));
const Campaigns = lazy(() => import('./components/finance/Campaigns'));
const AddBanner = lazy(() => import('./components/content/AddBanner'));
const AllBanners = lazy(() => import('./components/content/AllBanners'));
const UpdateBanner = lazy(() => import('./components/content/UpdateBanner'));
const AddCategory = lazy(() => import('./components/content/AddCategory'));
const AllCategories = lazy(() => import('./components/content/AllCategories'));
const AddSubCategory = lazy(() => import('./components/content/AddSubCategory'));
const AllSubCategories = lazy(() => import('./components/content/AllSubCategories'));
const AllBlogs = lazy(() => import('./components/blogmanagement/AllBlogs'));
const AddBlog = lazy(() => import('./components/blogmanagement/AddBlog'));
const EditBlog = lazy(() => import('./components/blogmanagement/EditBlog'));
const GymAnalytics = lazy(() => import('./components/gymanalytics/GymAnalytics'));
const Reports = lazy(() => import('./components/reports/Reports'));
const UsersView = lazy(() => import('./components/administration/Users'));
const RolesPermissions = lazy(() => import('./components/administration/RolesPermissions'));
const AuditTrail = lazy(() => import('./components/administration/AuditTrail'));
const VersionView = lazy(() => import('./components/administration/Version'));
const EmailSettingsView = lazy(() => import('./components/settings/EmailSettings'));
const CommunicationSettingsView = lazy(() => import('./components/settings/CommunicationSettings'));
const EmailTemplatesView = lazy(() => import('./components/settings/EmailTemplates'));
const EmailLogsView = lazy(() => import('./components/settings/EmailLogs'));
const GenericView = lazy(() => import('./components/GenericView'));

const PageLoadingSpinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', width: '100%' }}>
    <div style={{ width: '38px', height: '38px', border: '3.5px solid #f1f5f9', borderTopColor: '#ea580c', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
  </div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeNav, setActiveNav] = useState('/dashboard');
  const [selectedGym, setSelectedGym] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBannerForEdit, setSelectedBannerForEdit] = useState(null);
  const [selectedBlogForEdit, setSelectedBlogForEdit] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAddGymOpen, setIsAddGymOpen] = useState(false);
  const [isAddOwnerOpen, setIsAddOwnerOpen] = useState(false);
  const [drawerConfig, setDrawerConfig] = useState({ isOpen: false, type: 'gyms' });
  const [infoModal, setInfoModal] = useState({ isOpen: false, title: '', content: '' });
  const [toasts, setToasts] = useState([]);

  const handleNavChange = (newNav) => {
    setActiveNav(newNav);
    setSelectedGym(null);
    setSelectedMember(null);
    setIsMobileOpen(false);
  };

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleAddGymSubmit = (data) => {
    addToast(`Gym "${data.name}" added successfully!`);
  };

  const handleAddOwnerSubmit = (data) => {
    addToast(`Owner "${data.name}" registered successfully!`);
  };

  const handleCardClick = (statIdOrLabel) => {
    const key = (statIdOrLabel || '').toString().toLowerCase();
    let type = 'gyms';
    if (key.includes('gym')) {
      type = 'gyms';
    } else if (key.includes('inactive owner')) {
      type = 'inactive_owners';
    } else if (key.includes('owner')) {
      type = 'owners';
    } else if (key.includes('revenue')) {
      type = 'revenue';
    } else if (key.includes('due') || key.includes('pending')) {
      type = 'dues';
    } else if (key.includes('expir')) {
      type = 'expiring_sub';
    } else if (key.includes('sub') || key.includes('active sub')) {
      type = 'active_sub';
    }
    setDrawerConfig({ isOpen: true, type });
  };

  const handleQuickAction = (action) => {
    const id = action.id;
    if (id === 'add_gym' || id === 'add_owner') {
      setActiveNav('/members/add');
    } else if (id === 'all_gyms') {
      setActiveNav('/members/gyms');
    } else if (id === 'all_owners' || id === 'users') {
      setActiveNav('/members/list');
    } else if (id === 'invoices') {
      setActiveNav('/finance/invoices');
    } else if (id === 'blog_posts') {
      setActiveNav('/blogs');
    } else if (id === 'analytics') {
      setActiveNav('/analytics');
    } else if (id === 'plans') {
      setActiveNav('/members/plans');
    } else if (id === 'reports') {
      setActiveNav('/finance/reports');
    } else if (id === 'audit_log') {
      setActiveNav('/members/audit');
    } else if (id === 'bulk_upload') {
      setActiveNav('/members/bulk-upload');
    } else {
      setActiveNav('/dashboard');
    }
    addToast(`Opened ${action.label}`);
  };

  const handleViewAll = (sectionTitle) => {
    const title = (sectionTitle || '').toLowerCase();
    if (title.includes('invoice')) {
      setActiveNav('/finance/invoices');
    } else if (title.includes('payment')) {
      setActiveNav('/finance/payments');
    } else if (title.includes('gym')) {
      setActiveNav('/members/gyms');
    } else if (title.includes('owner') || title.includes('member')) {
      setActiveNav('/members/list');
    } else {
      setActiveNav('/members/gyms');
    }
    addToast(`View all ${sectionTitle}`);
  };

  const isAddMemberView = activeNav === '/members/add';
  const isGymListView = activeNav === '/members/gyms';
  const isCityReportView = activeNav === '/members/city-report';
  const isOnboardingPerformanceView = activeNav === '/members/performance';
  const isBulkUploadGymView = activeNav === '/members/bulk-upload';
  const isSubscriptionPlansView = activeNav === '/members/plans';
  const isSubscriptionAuditView = activeNav === '/members/audit';
  const isInvoicesView = activeNav === '/finance/invoices' || activeNav === '/finance';
  const isAdvanceReportsView = activeNav === '/finance/reports';
  const isPaymentsView = activeNav === '/finance/payments';
  const isCampaignsView = activeNav === '/finance/campaigns';
  const isAddBannerView = activeNav === '/content/banner/add';
  const isUpdateBannerView = activeNav === '/content/banner/update';
  const isAllBannersView = activeNav === '/content/banner/all' || activeNav === '/content/banner';
  const isAddCategoryView = activeNav === '/content/category/add';
  const isAllCategoriesView = activeNav === '/content/category/all';
  const isAddSubCategoryView = activeNav === '/content/subcategory/add';
  const isAllSubCategoriesView = activeNav === '/content/subcategory/all' || activeNav === '/content/subcategory';
  const isEditBlogView = activeNav === '/blogs/edit';
  const isAddBlogView = activeNav === '/blogs/add' || activeNav === '/blogs/create';
  const isAllBlogsView = activeNav === '/blogs' || activeNav === '/blogs/all';
  const isGymAnalyticsView = activeNav === '/analytics' || activeNav === '/gym-analytics';
  const isReportsView = activeNav === '/reports' || activeNav === '/finance/reports';
  const isAdminUsersView = activeNav === '/administration/users' || activeNav === '/administration/admins';
  const isRolesPermissionsView = activeNav === '/administration/roles&permissions' || activeNav === '/administration/roles';
  const isAuditTrailView = activeNav === '/administration/audittrail' || activeNav === '/administration/audit';
  const isVersionView = activeNav === '/administration/version';
  const isEmailSettingsView = activeNav === '/settings/emailSettings' || activeNav === '/settings/email';
  const isCommunicationSettingsView = activeNav === '/settings/communicationSettings' || activeNav === '/settings/communication';
  const isEmailTemplatesView = activeNav === '/settings/template' || activeNav === '/settings/templates';
  const isEmailLogsView = activeNav === '/settings/logs' || activeNav === '/settings/emaillogs';
  const isMembersView = activeNav === 'members' || activeNav === '/members/list';
  const isDashboardView = activeNav === '/dashboard' || activeNav === 'dashboard';

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={(userData) => {
          setIsAuthenticated(true);
          addToast(`Logged in successfully as ${userData.username || 'Admin'}`);
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={handleNavChange}
        onActionTrigger={(msg) => addToast(msg)}
        onSignOut={() => {
          setIsAuthenticated(false);
          addToast('Signed out successfully');
        }}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className={`main-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Header
          onNotificationClick={() => addToast('3 unread notifications')}
          onProfileClick={() => addToast('Logged in as Super Admin (Kodexive Gym)')}
          onToggleSidebar={() => setIsMobileOpen((prev) => !prev)}
        />

        <main className="dashboard-content">
          <Suspense fallback={<PageLoadingSpinner />}>
            {selectedMember ? (
              <MemberDetail 
                memberData={selectedMember} 
                onBack={() => setSelectedMember(null)} 
                onActionTrigger={(msg) => addToast(msg)}
                onOpenAddGym={() => setIsAddGymOpen(true)}
              />
            ) : selectedGym ? (
              <GymDetail 
                gymData={selectedGym} 
                onBack={() => setSelectedGym(null)} 
                onActionTrigger={(msg) => addToast(msg)} 
              />
            ) : isAddMemberView ? (
              <AddMember onBack={() => setActiveNav('/members/list')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isGymListView ? (
              <GymList 
                onActionTrigger={(msg) => addToast(msg)} 
                onOpenAddGym={() => setIsAddGymOpen(true)}
                onOpenAnalytics={() => setActiveNav('/analytics')}
                onSelectGym={(gym) => setSelectedGym(gym)}
              />
            ) : isCityReportView ? (
              <CityReport onActionTrigger={(msg) => addToast(msg)} />
            ) : isOnboardingPerformanceView ? (
              <OnboardingPerformance onActionTrigger={(msg) => addToast(msg)} />
            ) : isBulkUploadGymView ? (
              <BulkUploadGym onBack={() => setActiveNav('/members/list')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isSubscriptionPlansView ? (
              <SubscriptionPlans onNavigateToGyms={() => setActiveNav('/members/gyms')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isSubscriptionAuditView ? (
              <SubscriptionAudit onActionTrigger={(msg) => addToast(msg)} />
            ) : isInvoicesView ? (
              <Invoices onActionTrigger={(msg) => addToast(msg)} />
            ) : isAdvanceReportsView ? (
              <AdvanceReports onActionTrigger={(msg) => addToast(msg)} />
            ) : isPaymentsView ? (
              <Payments onNavigateToInvoices={() => setActiveNav('/finance/invoices')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isCampaignsView ? (
              <Campaigns onActionTrigger={(msg) => addToast(msg)} />
            ) : isAddBannerView ? (
              <AddBanner onBack={() => setActiveNav('/content/banner/all')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isUpdateBannerView ? (
              <UpdateBanner bannerData={selectedBannerForEdit} onBack={() => setActiveNav('/content/banner/all')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isAddCategoryView ? (
              <AddCategory onBack={() => setActiveNav('/content/category/all')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isAllCategoriesView ? (
              <AllCategories onNavigateToAdd={() => setActiveNav('/content/category/add')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isAddSubCategoryView ? (
              <AddSubCategory onBack={() => setActiveNav('/content/subcategory/all')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isAllSubCategoriesView ? (
              <AllSubCategories onNavigateToAdd={() => setActiveNav('/content/subcategory/add')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isEditBlogView ? (
              <EditBlog blogData={selectedBlogForEdit} onBack={() => setActiveNav('/blogs')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isAddBlogView ? (
              <AddBlog blogData={selectedBlogForEdit} onBack={() => setActiveNav('/blogs')} onActionTrigger={(msg) => addToast(msg)} />
            ) : isAllBlogsView ? (
              <AllBlogs 
                onNavigateToAdd={() => {
                  setSelectedBlogForEdit(null);
                  setActiveNav('/blogs/add');
                }} 
                onNavigateToEdit={(blog) => {
                  setSelectedBlogForEdit(blog);
                  setActiveNav('/blogs/edit');
                }} 
                onActionTrigger={(msg) => addToast(msg)} 
              />
            ) : isGymAnalyticsView ? (
              <GymAnalytics onActionTrigger={(msg) => addToast(msg)} />
            ) : isReportsView ? (
              <Reports
                onNavigateToInvoices={() => setActiveNav('/finance/invoices')}
                onNavigateToGyms={() => setActiveNav('/members/gyms')}
                onActionTrigger={(msg) => addToast(msg)}
              />
            ) : isAdminUsersView ? (
              <UsersView
                onNavigateToRoles={() => setActiveNav('/administration/roles&permissions')}
                onActionTrigger={(msg) => addToast(msg)}
              />
            ) : isRolesPermissionsView ? (
              <RolesPermissions
                onActionTrigger={(msg) => addToast(msg)}
              />
            ) : isAuditTrailView ? (
              <AuditTrail
                onActionTrigger={(msg) => addToast(msg)}
              />
            ) : isVersionView ? (
              <VersionView
                onNavigateToRoles={() => setActiveNav('/administration/roles&permissions')}
                onActionTrigger={(msg) => addToast(msg)}
              />
            ) : isEmailSettingsView ? (
              <EmailSettingsView
                onActionTrigger={(msg) => addToast(msg)}
              />
            ) : isCommunicationSettingsView ? (
              <CommunicationSettingsView
                onActionTrigger={(msg) => addToast(msg)}
              />
            ) : isEmailTemplatesView ? (
              <EmailTemplatesView
                onActionTrigger={(msg) => addToast(msg)}
              />
            ) : isEmailLogsView ? (
              <EmailLogsView
                onActionTrigger={(msg) => addToast(msg)}
              />
            ) : isAllBannersView ? (
              <AllBanners 
                onNavigateToAdd={() => setActiveNav('/content/banner/add')} 
                onNavigateToUpdate={(banner) => {
                  setSelectedBannerForEdit(banner);
                  setActiveNav('/content/banner/update');
                }} 
                onActionTrigger={(msg) => addToast(msg)} 
              />
            ) : isMembersView ? (
              <Member activeNav={activeNav} onActionTrigger={(msg) => addToast(msg)} onSelectMember={(mem) => setSelectedMember(mem)} />
            ) : isDashboardView ? (
              <>
                {/* Greeting & Quick Action Buttons Header */}
                <GreetingHeader
                  onOpenAddGym={() => setActiveNav('/members/add')}
                  onOpenAddOwner={() => setActiveNav('/members/add')}
                />

                {/* Metric Cards Row 1 & 2 */}
                <StatCards onCardClick={handleCardClick} />

                {/* Quick Actions Grid */}
                <QuickActions onActionClick={handleQuickAction} />

                {/* Revenue Trend & Subscriptions Charts */}
                <AnalyticsCharts
                  onViewInvoices={() => handleViewAll('Invoices')}
                />

                {/* 2x2 Tables Grid: Payments, Subscriptions, Gym Owners, Inactive Owners */}
                <DashboardGrids onViewAll={handleViewAll} />
              </>
            ) : (
              <GenericView path={activeNav} onActionTrigger={(msg) => addToast(msg)} />
            )}
          </Suspense>
        </main>
      </div>

      {/* Interactive Modals */}
      <AddGymModal
        isOpen={isAddGymOpen}
        onClose={() => setIsAddGymOpen(false)}
        onSubmit={handleAddGymSubmit}
      />

      <AddOwnerModal
        isOpen={isAddOwnerOpen}
        onClose={() => setIsAddOwnerOpen(false)}
        onSubmit={handleAddOwnerSubmit}
      />

      <InfoModal
        title={infoModal.title}
        content={infoModal.content}
        isOpen={infoModal.isOpen}
        onClose={() => setInfoModal({ isOpen: false, title: '', content: '' })}
      />

      {/* Records Side Drawer Panel */}
      <GymsSideDrawer
        isOpen={drawerConfig.isOpen}
        type={drawerConfig.type}
        onClose={() => setDrawerConfig((prev) => ({ ...prev, isOpen: false }))}
        onViewAll={(navPath) => {
          setDrawerConfig((prev) => ({ ...prev, isOpen: false }));
          if (navPath) setActiveNav(navPath);
        }}
        onSelectGym={(item, navPath) => {
          setDrawerConfig((prev) => ({ ...prev, isOpen: false }));
          if (navPath) setActiveNav(navPath);
          addToast(`Viewing details for ${item.name}`);
        }}
      />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <CheckCircle2 size={18} style={{ color: '#10B981' }} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
