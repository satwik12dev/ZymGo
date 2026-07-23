const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Universal fetch wrapper for ZymGo backend API
 */
async function apiCall(endpoint, method = 'GET', body = null, isFormData = false, customHeaders = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    ...customHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (body && !isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // Handle CSV or text downloads
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/csv') || contentType.includes('application/octet-stream')) {
      const blob = await response.blob();
      return blob;
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || (data.errors ? data.errors.map(e => e.message).join(', ') : 'API request failed');
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Helper to build query parameter strings
 */
function buildQueryString(params = {}) {
  const cleanParams = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '');
  if (cleanParams.length === 0) return '';
  const query = new URLSearchParams(cleanParams).toString();
  return `?${query}`;
}

export const api = {
  // ── Auth & Dashboard ──
  auth: {
    login: (credentials) => apiCall('/admin/login', 'POST', credentials),
    logout: () => apiCall('/admin/logout', 'POST'),
    getDashboard: () => apiCall('/admin/dashboard', 'GET'),
  },

  // ── Gym & Members ──
  gym: {
    getGymList: (params) => apiCall(`/gym/gym-list${buildQueryString(params)}`, 'GET'),
    getMemberList: (params) => apiCall(`/members/list${buildQueryString(params)}`, 'GET'),
    getGymById: (id) => apiCall(`/gym/view-gym/${id}`, 'GET'),
    addGym: (data) => apiCall('/gym/add-gym', 'POST', data),
    updateGym: (id, data) => apiCall(`/gym/update-gym/${id}`, 'PUT', data),
    deleteGym: (id) => apiCall(`/gym/delete-gym/${id}`, 'DELETE'),
    bulkUploadGym: (formData) => apiCall('/gym/bulk-upload', 'POST', formData, true),
    getAnalytics: (params) => apiCall(`/gym/analytics${buildQueryString(params)}`, 'GET'),
    exportSummary: () => apiCall('/gym/analytics/export-summary', 'GET'),
    exportWithFilters: (params) => apiCall(`/gym/analytics/export-with-filters${buildQueryString(params)}`, 'GET'),
    exportStateAnalytics: () => apiCall('/gym/analytics/export-state-analytics', 'GET'),
  },

  // ── Subscriptions ──
  subscriptions: {
    getPlans: () => apiCall('/subscription/subscription-plans-list', 'GET'),
    addPlan: (data) => apiCall('/subscription/addSubscriptionPLan', 'POST', data),
    editPlan: (id, data) => apiCall(`/subscription/editplan/${id}`, 'PATCH', data),
    deletePlan: (id) => apiCall(`/subscription/deleteplan/${id}`, 'DELETE'),
    getAuditSummary: () => apiCall('/subscription-audit/summary', 'GET'),
    getAuditAdmins: () => apiCall('/subscription-audit/admins', 'GET'),
    getAuditLogs: (params) => apiCall(`/subscription-audit${buildQueryString(params)}`, 'GET'),
    findAuditLogs: (params) => apiCall(`/subscription-audit/find${buildQueryString(params)}`, 'GET'),
    buySubscription: (data) => apiCall('/gym-subscription/buy', 'POST', data),
    getSubscriptionStatus: (gymId) => apiCall(`/gym-subscription/status/${gymId}`, 'GET'),
  },

  // ── Finance ──
  finance: {
    getInvoices: (params) => apiCall(`/finance/getinvoices${buildQueryString(params)}`, 'GET'),
    getInvoiceById: (id) => apiCall(`/finance/getinvoices/${id}`, 'GET'),
    getInvoiceSummary: () => apiCall('/finance/invoices/summary', 'GET'),
    createInvoice: (data) => apiCall('/finance/createinvoice', 'POST', data),
    updateInvoice: (id, data) => apiCall(`/finance/updateinvoice/${id}`, 'PUT', data),
    updateInvoiceStatus: (id, status) => apiCall(`/finance/updateinvoicestatus/${id}`, 'PATCH', { status }),
    deleteInvoice: (id) => apiCall(`/finance/deleteinvoice/${id}`, 'DELETE'),
    getReports: (params) => apiCall(`/finance/getreports${buildQueryString(params)}`, 'GET'),
    getPayments: (params) => apiCall(`/finance/payments${buildQueryString(params)}`, 'GET'),
    exportPayments: () => apiCall('/finance/payments/export', 'GET'),
    getCampaigns: () => apiCall('/finance/campaigns', 'GET'),
    createCampaign: (data) => apiCall('/finance/campaigns', 'POST', data),
    updateCampaign: (id, data) => apiCall(`/finance/campaigns/${id}`, 'PUT', data),
    deleteCampaign: (id) => apiCall(`/finance/campaigns/${id}`, 'DELETE'),
  },

  // ── Content Management ──
  content: {
    addBanner: (formData) => apiCall('/banner/add-banner', 'POST', formData, true),
    getBanners: () => apiCall('/banner/all-banners', 'GET'),
    updateBanner: (id, formData) => apiCall(`/banner/update-banners/${id}`, 'PATCH', formData, true),

    addCategory: (formData) => apiCall('/categories/add-category', 'POST', formData, true),
    getCategories: () => apiCall('/categories/get-categories', 'GET'),
    getCategoryById: (id) => apiCall(`/categories/get-category/${id}`, 'GET'),
    updateCategory: (id, formData) => apiCall(`/categories/update-category/${id}`, 'PATCH', formData, true),
    deleteCategory: (id) => apiCall(`/categories/delete-category/${id}`, 'DELETE'),

    addSubCategory: (formData) => apiCall('/categories/add-sub-category', 'POST', formData, true),
    getSubCategories: () => apiCall('/categories/get-sub-categories', 'GET'),
    getSubCategoryByIdOrName: (idOrName) => apiCall(`/categories/get-sub-category/${idOrName}`, 'GET'),
    updateSubCategory: (id, formData) => apiCall(`/categories/update-sub-category/${id}`, 'PUT', formData, true),
    deleteSubCategory: (id) => apiCall(`/categories/delete-sub-category/${id}`, 'DELETE'),
  },

  // ── Blogs ──
  blogs: {
    getBlogs: () => apiCall('/blog/all-blogs', 'GET'),
    addBlog: (formData) => apiCall('/blog/add-blog', 'POST', formData, true),
    updateBlog: (id, formData) => apiCall(`/blog/update-blog/${id}`, 'PUT', formData, true),
    deleteBlog: (id) => apiCall(`/blog/delete-blog/${id}`, 'DELETE'),
  },

  // ── Admin & Users & Roles & Audit ──
  admin: {
    createUser: (data) => apiCall('/admin/Createusers', 'POST', data),
    getUsers: (params) => apiCall(`/admin/Getusers${buildQueryString(params)}`, 'GET'),
    getUserStats: () => apiCall('/admin/users/stats', 'GET'),
    getUserById: (id) => apiCall(`/admin/getusersById/${id}`, 'GET'),
    updateUser: (id, data) => apiCall(`/admin/Updateusers/${id}`, 'PUT', data),
    toggleUserBlock: (id, is_blocked) => apiCall(`/admin/Toggleusers/${id}`, 'PATCH', { is_blocked }),
    deleteUser: (id) => apiCall(`/admin/Deleteusers/${id}`, 'DELETE'),

    createRole: (data) => apiCall('/admin/Createroles', 'POST', data),
    getRoles: () => apiCall('/admin/Getroles', 'GET'),
    updateRole: (roleId, data) => apiCall(`/admin/Updateroles/${roleId}`, 'PUT', data),
    toggleRoleStatus: (roleId, is_active) => apiCall(`/admin/Toggleroles/${roleId}`, 'PATCH', { is_active }),
    deleteRole: (roleId) => apiCall(`/admin/Deleteroles/${roleId}`, 'DELETE'),

    getRolePermissions: (roleId) => apiCall(`/admin/GetrolesPermissions/${roleId}`, 'GET'),
    updateRolePermissions: (roleId, permissions) => apiCall(`/admin/UpdaterolesPermissions/${roleId}`, 'PUT', { permissions }),
    getAllPermissions: () => apiCall('/admin/Getallpermissions', 'GET'),

    getRoleAssignments: () => apiCall('/admin/Getrole-assignments', 'GET'),
    assignRoleToUser: (userId, role_id) => apiCall(`/admin/Updateusers/${userId}/role`, 'PATCH', { role_id }),
    getUserPermissions: (userId) => apiCall(`/admin/GetusersPermissions/${userId}`, 'GET'),

    getAuditStats: () => apiCall('/admin/audit-trail/stats', 'GET'),
    getAuditLogs: (params) => apiCall(`/admin/audit-trail${buildQueryString(params)}`, 'GET'),
    getAuditFilterOptions: () => apiCall('/admin/audit-trail/filters', 'GET'),
  },

  // ── Reports ──
  reports: {
    getReportDashboard: (params) => apiCall(`/gym/report${buildQueryString(params)}`, 'GET'),
    exportReports: () => apiCall('/gym/report/export', 'GET'),
  },
};

export default api;
