import React, { useState, lazy, Suspense, useCallback, useMemo, useTransition, useEffect, useRef } from 'react';
import Sidebar, { menuItems } from './components/Sidebar';
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
import api from './services/api';

// Lazy loaded views for instant page load & code splitting
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Member = lazy(() => import('./components/member/Member'));
const AddMember = lazy(() => import('./components/member/AddMember'));
const GymList = lazy(() => import('./components/member/GymList'));
const GymDetail = lazy(() => import('./components/member/GymDetail'));
const MemberDetail = lazy(() => import('./components/member/MemberDetail'));
const CityReport = lazy(() => import('./components/member/CityReport'));
const OnboardingPerformance = lazy(() => import('./components/member/OnboardingPerformance'));
const EditGym = lazy(() => import('./components/member/EditGym'));
const BulkUploadGym = lazy(() => import('./components/member/BulkUploadGym'));
const AddNewGym = lazy(() => import('./components/member/AddNewGym'));
const BulkUploadMember = lazy(() => import('./components/member/BulkUploadMember'));
const SubscriptionPlans = lazy(() => import('./components/member/SubscriptionPlans'));
const SubscriptionAudit = lazy(() => import('./components/member/SubscriptionAudit'));
const Invoices = lazy(() => import('./components/finance/Invoices'));
const CreateInvoice = lazy(() => import('./components/finance/CreateInvoice'));
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem('isAuthenticated');
    return stored === null ? true : stored === 'true';
  });
  const [activeNav, setActiveNav] = useState(() => {
    return localStorage.getItem('activeNav') || '/dashboard';
  });
  const [selectedGym, setSelectedGym] = useState(null);
  const [selectedGymForEdit, setSelectedGymForEdit] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBannerForEdit, setSelectedBannerForEdit] = useState(null);
  const [selectedBlogForEdit, setSelectedBlogForEdit] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAddGymOpen, setIsAddGymOpen] = useState(false);
  const [gymOwnerForAdd, setGymOwnerForAdd] = useState(null);
  const [invoiceGymData, setInvoiceGymData] = useState(null);
  const [isAddOwnerOpen, setIsAddOwnerOpen] = useState(false);
  const [drawerConfig, setDrawerConfig] = useState({ isOpen: false, type: 'gyms' });
  const [infoModal, setInfoModal] = useState({ isOpen: false, title: '', content: '' });
  const [toasts, setToasts] = useState([]);

  const [isPending, startTransition] = useTransition();
  const mainContentRef = useRef(null);

  const currentViewKey = useMemo(() => {
    if (selectedMember) return `member-${selectedMember.id || selectedMember.name || 'detail'}`;
    if (selectedGym) return `gym-${selectedGym.id || selectedGym.name || 'detail'}`;
    return activeNav;
  }, [selectedMember, selectedGym, activeNav]);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [dashboardStats, setDashboardStats] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadDashboardData() {
      // 1. Fetch user dashboard info (/admin/dashboard)
      try {
        const res = await api.auth.getDashboard();
        if (res.success && res.data) {
          setCurrentUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.warn('Dashboard user fetch fallback:', err.message);
      }

      // 2. Fetch gym report stats (/gym/report)
      try {
        const statsRes = await api.reports.getStats();
        if (statsRes.success && statsRes.data) {
          setDashboardStats(statsRes.data);
        }
      } catch (err) {
        console.warn('Dashboard stats fetch fallback:', err.message);
      }
    }

    loadDashboardData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentViewKey]);

  const handleNavChange = useCallback((newNav) => {
    localStorage.setItem('activeNav', newNav);
    startTransition(() => {
      setActiveNav(newNav);
      setSelectedGym(null);
      setSelectedMember(null);
    });
    setIsMobileOpen(false);
  }, []);

  const addToast = useCallback((message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const handleAddGymSubmit = useCallback((data) => {
    addToast(`Gym "${data.name}" added successfully!`);
  }, [addToast]);

  const handleAddOwnerSubmit = useCallback((data) => {
    addToast(`Owner "${data.name}" registered successfully!`);
  }, [addToast]);

  const handleCardClick = useCallback((statIdOrLabel) => {
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
  }, []);

  const handleQuickAction = useCallback((action) => {
    const id = action.id;
    startTransition(() => {
      if (id === 'add_gym') {
        setActiveNav('/members/gyms/add');
      } else if (id === 'all_gyms') {
        setActiveNav('/members/gyms');
      } else if (id === 'add_owner') {
        setActiveNav('/members/add');
      } else if (id === 'all_owners') {
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
      } else if (id == 'users') {
        setActiveNav('/administration/users')
      } else {
        setActiveNav('/dashboard');
      }
    });
    addToast(`Opened ${action.label}`);
  }, [addToast]);

  const handleViewAll = useCallback((sectionTitle) => {
    const title = (sectionTitle || '').toLowerCase();
    startTransition(() => {
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
    });
    addToast(`View all ${sectionTitle}`);
  }, [addToast]);

  const isAddMemberView = activeNav === '/members/add';
  const isGymListView = activeNav === '/members/gyms';
  const isEditGymView = activeNav === '/members/gyms/edit';
  const isAddGymView = activeNav === '/members/gyms/add' || activeNav === '/members/gym/add' || isAddGymOpen;
  const isCityReportView = activeNav === '/members/city-report';
  const isOnboardingPerformanceView = activeNav === '/members/performance';
  const isBulkUploadMemberView = activeNav === '/members/bulk-upload' || activeNav === '/members/bulk-upload-members';
  const isBulkUploadGymView = activeNav === '/members/bulk-upload-gym' || activeNav === '/members/bulk-upload-gyms';
  const isSubscriptionPlansView = activeNav === '/members/plans';
  const isSubscriptionAuditView = activeNav === '/members/audit';
  const isInvoicesView = activeNav === '/finance/invoices' || activeNav === '/finance';
  const isCreateInvoiceView = activeNav === '/finance/invoices/create' || activeNav === '/finance/invoices/new';
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

  const pageTitle = useMemo(() => {
    if (selectedMember) {
      return selectedMember.name ? `Member: ${selectedMember.name}` : 'Member Detail';
    }
    if (selectedGym) {
      return selectedGym.name ? `Gym: ${selectedGym.name}` : 'Gym Detail';
    }
    if (isAddMemberView) return 'Add Member';
    if (isAddGymView) return 'Add New Gym';
    if (isGymListView) return 'Gym List';
    if (isEditGymView) return 'Edit Gym';
    if (isCityReportView) return 'City Report';
    if (isOnboardingPerformanceView) return 'Onboarding Performance';
    if (isBulkUploadMemberView) return 'Bulk Upload Members';
    if (isBulkUploadGymView) return 'Bulk Upload Gym';
    if (isSubscriptionPlansView) return 'Subscription Plans';
    if (isSubscriptionAuditView) return 'Subscription Audit';
    if (isCreateInvoiceView) return 'Create Invoice';
    if (isInvoicesView) return 'Invoices';
    if (isAdvanceReportsView) return 'Advance Reports';
    if (isPaymentsView) return 'Payments';
    if (isCampaignsView) return 'Campaigns';
    if (isAddBannerView) return 'Add Banner';
    if (isUpdateBannerView) return 'Update Banner';
    if (isAllBannersView) return 'All Banners';
    if (isAddCategoryView) return 'Add Category';
    if (isAllCategoriesView) return 'All Categories';
    if (isAddSubCategoryView) return 'Add Sub Category';
    if (isAllSubCategoriesView) return 'All Sub Categories';
    if (isEditBlogView) return 'Edit Blog';
    if (isAddBlogView) return 'Add Blog';
    if (isAllBlogsView) return 'All Blogs';
    if (isGymAnalyticsView) return 'Gym Analytics';
    if (isReportsView) return 'Reports';
    if (isAdminUsersView) return 'Users';
    if (isRolesPermissionsView) return 'Roles & Permissions';
    if (isAuditTrailView) return 'Audit Trail';
    if (isVersionView) return 'Version';
    if (isEmailSettingsView) return 'Email Settings';
    if (isCommunicationSettingsView) return 'Communication Settings';
    if (isEmailTemplatesView) return 'Email Templates';
    if (isEmailLogsView) return 'Email Logs';
    if (isMembersView) return 'Member List';
    if (isDashboardView) return 'Dashboard';

    for (const item of menuItems) {
      if (item.path === activeNav) return item.title;
      if (item.children) {
        const found = item.children.find((c) => c.path === activeNav);
        if (found) return found.title;
      }
    }

    const cleanPath = (activeNav || '').replace(/^\//, '');
    const parts = cleanPath.split('/');
    if (parts.length > 0 && parts[0]) {
      const last = parts[parts.length - 1];
      return last
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }

    return 'Dashboard';
  }, [
    selectedMember, selectedGym, isAddMemberView, isGymListView, isCityReportView,
    isOnboardingPerformanceView, isBulkUploadMemberView, isBulkUploadGymView, isSubscriptionPlansView,
    isSubscriptionAuditView, isInvoicesView, isAdvanceReportsView, isPaymentsView,
    isCampaignsView, isAddBannerView, isUpdateBannerView, isAllBannersView,
    isAddCategoryView, isAllCategoriesView, isAddSubCategoryView, isAllSubCategoriesView,
    isEditBlogView, isAddBlogView, isAllBlogsView, isGymAnalyticsView, isReportsView,
    isAdminUsersView, isRolesPermissionsView, isAuditTrailView, isVersionView,
    isEmailSettingsView, isCommunicationSettingsView, isEmailTemplatesView,
    isEmailLogsView, isMembersView, isDashboardView, activeNav
  ]);

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={(userData) => {
          localStorage.setItem('isAuthenticated', 'true');
          setIsAuthenticated(true);
          addToast(`Logged in successfully as ${userData.username || 'Admin'}`);
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Page Navigation Progress Loader */}
      <div className={`top-page-loader ${isPending ? 'active' : ''}`} />

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
          localStorage.setItem('isAuthenticated', 'false');
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
          title={pageTitle}
          currentUser={currentUser}
          onNotificationClick={() => addToast('3 unread notifications')}
          onProfileClick={() => addToast(`Logged in as ${currentUser?.role_name || currentUser?.role || 'Super Admin'} (${currentUser?.name || 'Kodexive Gym'})`)}
          onToggleSidebar={() => setIsMobileOpen((prev) => !prev)}
        />

        <main className="dashboard-content" ref={mainContentRef}>
          <div key={currentViewKey} className="page-transition-container">
            <Suspense fallback={<PageLoadingSpinner />}>
              {selectedMember ? (
                <MemberDetail
                  memberData={selectedMember}
                  onBack={() => setSelectedMember(null)}
                  onActionTrigger={(msg) => addToast(msg)}
                  onOpenAddGym={(owner) => {
                    setGymOwnerForAdd(owner || selectedMember);
                    setSelectedMember(null);
                    setSelectedGym(null);
                    setSelectedGymForEdit(null);
                    setIsAddGymOpen(true);
                    setActiveNav('/members/gyms/add');
                  }}
                  onViewGym={(gym) => {
                    setSelectedMember(null);
                    setSelectedGym(gym);
                  }}
                  onEditGym={(gym) => {
                    setSelectedMember(null);
                    setSelectedGym(null);
                    setSelectedGymForEdit(gym);
                    setActiveNav('/members/gyms/edit');
                  }}
                />
              ) : isAddGymView ? (
                <AddNewGym
                  memberData={gymOwnerForAdd}
                  ownerName={gymOwnerForAdd?.name || (typeof gymOwnerForAdd === 'string' ? gymOwnerForAdd : '')}
                  onBack={() => {
                    setIsAddGymOpen(false);
                    setGymOwnerForAdd(null);
                    setActiveNav('/members/gyms');
                  }}
                  onActionTrigger={(msg) => addToast(msg)}
                  onViewOwnerDetails={(ownerName) => {
                    setIsAddGymOpen(false);
                    setGymOwnerForAdd(null);
                    setSelectedGymForEdit(null);
                    setSelectedGym(null);
                    setActiveNav('/members/list');
                    setSelectedMember({
                      id: 1,
                      name: ownerName || 'yuvraj',
                      memberId: '0000013957',
                      phone: '7505690374',
                      email: 'singhyuvraj0374@gmail.com',
                      address: 'Moradabad',
                      city: 'Moradabad',
                      state: 'Uttar Pradesh',
                      pincode: '244001',
                      gymsCount: 2,
                      activeGyms: 2,
                      status: 'Inactive',
                      verified: false,
                      initials: (ownerName || 'YU').slice(0, 2).toUpperCase(),
                      registeredDate: '16 Jul 2026'
                    });
                  }}
                />
              ) : selectedGym ? (
                <GymDetail
                  gymData={selectedGym}
                  onBack={() => setSelectedGym(null)}
                  onActionTrigger={(msg) => addToast(msg)}
                  onEditGym={(gym) => {
                    setSelectedGym(null);
                    setSelectedMember(null);
                    setSelectedGymForEdit(gym);
                    setActiveNav('/members/gyms/edit');
                  }}
                  onCreateInvoice={(gym) => {
                    setInvoiceGymData(gym || selectedGym);
                    setSelectedGym(null);
                    setSelectedMember(null);
                    setActiveNav('/finance/invoices/create');
                  }}
                />
              ) : isAddMemberView ? (
                <AddMember onBack={() => setActiveNav('/members/list')} onActionTrigger={(msg) => addToast(msg)} />
              ) : isEditGymView ? (
                <EditGym
                  gym={selectedGymForEdit}
                  onBack={() => setActiveNav('/members/gyms')}
                  onActionTrigger={(msg) => addToast(msg)}
                  onViewOwnerDetails={(ownerName) => {
                    setSelectedGymForEdit(null);
                    setSelectedGym(null);
                    setActiveNav('/members/list');
                    setSelectedMember({
                      id: 1,
                      name: ownerName || 'yuvraj',
                      memberId: '0000013957',
                      phone: '7505690374',
                      email: 'singhyuvraj0374@gmail.com',
                      address: 'Moradabad',
                      city: 'Moradabad',
                      state: 'Uttar Pradesh',
                      pincode: '244001',
                      gymsCount: 2,
                      activeGyms: 2,
                      status: 'Inactive',
                      verified: false,
                      initials: (ownerName || 'YU').slice(0, 2).toUpperCase(),
                      registeredDate: '16 Jul 2026'
                    });
                  }}
                />
              ) : isGymListView ? (
                <GymList
                  onActionTrigger={(msg) => addToast(msg)}
                  onOpenAddGym={() => {
                    setSelectedMember(null);
                    setSelectedGym(null);
                    setSelectedGymForEdit(null);
                    setIsAddGymOpen(true);
                    setActiveNav('/members/gyms/add');
                  }}
                  onOpenAnalytics={() => setActiveNav('/analytics')}
                  onSelectGym={(gym) => setSelectedGym(gym)}
                  onSelectMember={(ownerName) => {
                    setSelectedGymForEdit(null);
                    setSelectedGym(null);
                    setActiveNav('/members/list');
                    setSelectedMember({
                      id: 1,
                      name: ownerName || 'yuvraj',
                      memberId: '0000013957',
                      phone: '7505690374',
                      email: 'singhyuvraj0374@gmail.com',
                      address: 'Moradabad',
                      city: 'Moradabad',
                      state: 'Uttar Pradesh',
                      pincode: '244001',
                      gymsCount: 2,
                      activeGyms: 2,
                      status: 'Inactive',
                      verified: false,
                      initials: (ownerName || 'YU').slice(0, 2).toUpperCase(),
                      registeredDate: '16 Jul 2026'
                    });
                  }}
                  onNavigateToBulkUploadGym={() => setActiveNav('/members/bulk-upload-gym')}
                  onNavigateToEditGym={(gym) => {
                    setSelectedGymForEdit(gym);
                    setActiveNav('/members/gyms/edit');
                  }}
                />
              ) : isCityReportView ? (
                <CityReport onActionTrigger={(msg) => addToast(msg)} />
              ) : isOnboardingPerformanceView ? (
                <OnboardingPerformance onActionTrigger={(msg) => addToast(msg)} />
              ) : isBulkUploadMemberView ? (
                <BulkUploadMember onBack={() => setActiveNav('/members/list')} onActionTrigger={(msg) => addToast(msg)} />
              ) : isBulkUploadGymView ? (
                <BulkUploadGym onBack={() => setActiveNav('/members/gyms')} onActionTrigger={(msg) => addToast(msg)} />
              ) : isSubscriptionPlansView ? (
                <SubscriptionPlans onNavigateToGyms={() => setActiveNav('/members/gyms')} onActionTrigger={(msg) => addToast(msg)} />
              ) : isSubscriptionAuditView ? (
                <SubscriptionAudit onActionTrigger={(msg) => addToast(msg)} />
              ) : isCreateInvoiceView ? (
                <CreateInvoice
                  gymData={invoiceGymData}
                  onBack={() => {
                    setActiveNav(invoiceGymData ? '/members/gyms' : '/finance/invoices');
                    setInvoiceGymData(null);
                  }}
                  onActionTrigger={(msg) => addToast(msg)}
                />
              ) : isInvoicesView ? (
                <Invoices
                  onActionTrigger={(msg) => addToast(msg)}
                  onNavigateToCreate={() => {
                    setInvoiceGymData(null);
                    setActiveNav('/finance/invoices/create');
                  }}
                />
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
                <Member
                  activeNav={activeNav}
                  onActionTrigger={(msg) => addToast(msg)}
                  onSelectMember={(mem) => setSelectedMember(mem)}
                  onNavigateToAddMember={() => setActiveNav('/members/add')}
                  onNavigateToBulkUpload={() => setActiveNav('/members/bulk-upload')}
                />
              ) : isDashboardView ? (
                <Dashboard
                  onNavigate={handleNavChange}
                  onCardClick={handleCardClick}
                  onActionTrigger={(msg) => addToast(msg)}
                />
              ) : (
                <GenericView path={activeNav} onActionTrigger={(msg) => addToast(msg)} />
              )}
            </Suspense>
          </div>
        </main>
      </div>

      {/* Interactive Modals */}

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
