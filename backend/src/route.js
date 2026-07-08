require("dotenv").config()
const express = require("express")
const route = express()
const cors = require("cors")

const {Login}  = require("./controller/login/login.controller") // Importing the login controller from the controller folder
const authenticate = require("./middleware/auth.middleware")
const { dashboard } = require("./controller/dashboard/dashboard.controller")
const {LogOut} = require("./controller/login/logout.controller")

const {getGymList} = require("./controller/gym/gymlist.controller")
const {getMemberList} = require("./controller/gym/memberlist.controller")
const { addGym } = require("./controller/gym/AddGym.controller")
const { updateGym } = require("./controller/gym/UpdateGym.controller")
const { deleteGym } = require("./controller/gym/DeleteGym.controller")
const {viewGymById} = require("./controller/gym/ViewGym.controller")
const uploadCsv = require("./middleware/uploadCsv.middleware");
const {bulkUploadGym } = require("./controller/gym/BulkAddGym.controller");


const {getAllSubscriptionPlans, buyGymSubscription, getGymSubscriptionStatus} = require("./controller/Subscription/subscriptionPlan.controller")
const addSubscriptionPlan = require("./controller/Subscription/AddPlans.controller")
const editSubscriptionPlan = require("./controller/Subscription/EditSubscriptionPlan.controller")
const deleteSubscriptionPlan = require("./controller/Subscription/DeletePLans.controller")
const {
  getSubscriptionAuditSummary,
  getSubscriptionAuditLogs,
  getSubscriptionAuditAdmins,
  getSubscriptionAuditfindLogs
} = require("./controller/Subscription/SubscriptionAudit.controller");


const authorize = require("./middleware/roles.middleware")
const bannerUpload = require("./middleware/bannerUpload.middleware")


const { addBanner } = require("./controller/content/AddBanner.controller")
const updateBanner  = require("./controller/content/updateBanner.controller")
const getAllBanners = require("./controller/content/getAllBanners.controller")
const upload = require("./middleware/Category.middleware");
const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("./controller/content/Category.controller");

const {
  addSubCategory,
  getAllSubCategories,
  getSubCategoryByIdOrName,
  updateSubCategory,
  deleteSubCategory,
} = require("./controller/content/SubCategory.controller");
const uploadsub = require("./middleware/SubCategory.middleware")


const blogUpload = require("./middleware/blogUpload");
const { addBlog, getAllBlogs, updateBlog, deleteBlog } = require("./controller/blogs/Blog.controller");

const {getGymAnalytics,
  exportGymAnalyticsSummary,
  exportGymAnalyticsWithFilters,
  exportStateAnalyticsCSV } = require("./controller/gym/gymAnalytics.controller")


const getReportsDashboard  = require("./controller/reports/report.controller");
const exportReports = require("./controller/reports/exportReports.controller");


const {
createUser,
getUsers,
getUserById,
updateUser,
getUserStats,
toggleUserBlock,
deleteUser,
getAllPermissions,
} = require("./controller/admin/userController");

const {
createRole,
getRoles,
getRolePermissions,
updateRolePermissions,
updateRole,
toggleRoleStatus,
getRoleAssignments,
assignRoleToUser,
getUserPermissions,
deleteRole,
} = require("./controller/admin/roles&permission.controller");

const {
  getAuditLogs,
  getAuditFilterOptions,
  getAuditStats,
} = require("./controller/admin/auditTrail.controller");



const {
  getInvoiceSummary,
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  sendInvoiceByEmail,
  sendInvoiceByWhatsApp,
} = require("./controller/finances/invoice.controller");

const { getAdvancedFinanceReport } = require("./controller/finances/advancedReport.controller");

const {
  getPayments,
  exportPaymentsCSV
} = require("./controller/finances/payment.controller");

const {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign
} = require("./controller/finances/campaign.controller");

route.use(express.json())
route.use(cors())
route.set("trust proxy", true), 


/**
 * @route /admin/login
 * @description 
 */
route.post("/admin/login", Login);

/**
 * @route /admin/logout
 * @description
 */
route.post("/admin/logout", authenticate, LogOut)


/**
 * @route /admin/dashboard
 * @description 
 */
route.get("/admin/dashboard", authenticate, dashboard)


/*****************************************************
                    Gym API's
*******************************************************/
route.get( "/members/list", authenticate, authorize('Super Admin', 'Admin'), getMemberList);

/**
 * @route /gym/gym-list
 * @description
 */
route.get("/gym/gym-list", authenticate, authorize('Super Admin', 'Admin'), getGymList)

/**
 * @route /gym/add-gym
 * @description
 */
route.post("/gym/add-gym", authenticate, authorize('Super Admin'), addGym)

/**
 * @route /gym/update-gym/:id
 * @description 
 */
route.put("/gym/update-gym/:id", authenticate, authorize('Super Admin'), updateGym)

/**
 * @route /gym/delete-gym/:id
 * @description
 */
route.delete("/gym/delete-gym/:id", authenticate, authorize('Super Admin'), deleteGym)

/**
 * @route /gym/view-gym/:id
 * @description
 */
route.get("/gym/view-gym/:id", authenticate, authorize('Super Admin', 'Admin'), viewGymById)

/**
 * @route /gym/performance
 * @description
 */


/**
 * @route /gym/bulk-add-gym
 * @description 
 */
route.post("/gym/bulk-upload",authenticate,authorize("Super Admin"), uploadCsv.single("file"),bulkUploadGym);



/**
 * @route /subscription/subscription-plans-list
 * @description
 */
route.get("/subscription/subscription-plans-list", authenticate, authorize("Super Admin"), getAllSubscriptionPlans,)

/**
 * @route /subscription/addSubscriptionPLan
 * @description
 */
route.post("/subscription/addSubscriptionPLan", authenticate, authorize('Super Admin'), addSubscriptionPlan)

/**
 * @route /subscription/editplan
 * @description
 */
route.patch("/subscription/editplan/:id",authenticate, authorize("Super Admin"), editSubscriptionPlan);

/**
 * @route /subscription/deleteplan/:id
 * @description
 */
route.delete("/subscription/deleteplan/:id", authenticate, authorize("Super Admin"), deleteSubscriptionPlan)


/**
 * @route /gym/subscription-audit
 * @description
 */
route.get("/subscription-audit/summary",authenticate,authorize("Super Admin"),getSubscriptionAuditSummary);

/**
 * @route /gym/subscription-audit/admins
 * @description
 */
route.get("/subscription-audit/admins",authenticate,authorize("Super Admin"),getSubscriptionAuditAdmins);

/**
 * @route /gym/subscription-audit
 * @description
 */
route.get("/subscription-audit",authenticate,authorize("Super Admin"),getSubscriptionAuditLogs);

/**
 * @route /gym/subscription-audit/find
 * @description
 */

route.get("/subscription-audit/find",authenticate,authorize("Super Admin"),getSubscriptionAuditfindLogs);

/**
 * @route /gym-subscription/buy
 * @description
 */
route.post("/gym-subscription/buy",authenticate,buyGymSubscription);
 
/**
 *  @route /gym-subscription/status/:gym_id
 *  @description
 */
route.get("/gym-subscription/status/:gym_id",authenticate,authorize("Super Admin", "Admin"),getGymSubscriptionStatus);
/*****************************************************
                    FINANCE API's
*******************************************************/
/**
 * @route /finance/invoices
 * @description
 */
route.get("/finance/getinvoices", authenticate, authorize("Super Admin"), getInvoices);
route.get("/finance/getinvoices/:id", authenticate, authorize("Super Admin"), getInvoiceById);
route.post("/finance/createinvoice", authenticate, authorize("Super Admin"), createInvoice);
route.put("/finance/updateinvoice/:id", authenticate, authorize("Super Admin"), updateInvoice);
route.delete("/finance/deleteinvoice/:id", authenticate, authorize("Super Admin"), deleteInvoice);
route.patch("/finance/updateinvoicestatus/:id", authenticate, authorize("Super Admin"), updateInvoiceStatus);
route.get("/finance/invoices/summary", authenticate, authorize("Super Admin"), getInvoiceSummary);


/**
 * @route /finance/reports
 * @description
 */
route.get("/finance/getreports", authenticate, authorize("Super Admin"), getAdvancedFinanceReport);

/**
 * @route /finance/payments
 * @description
 */
route.get("/finance/payments", authenticate, authorize("Super Admin"), getPayments);
route.get("/finance/payments/export", authenticate, authorize("Super Admin"), exportPaymentsCSV);

/**
 * @route /finance/campaigns
 * @description
 */
route.get("/finance/campaigns", authenticate, authorize("Super Admin"), getCampaigns);
route.post("/finance/campaigns", authenticate, authorize("Super Admin"), createCampaign);
route.put("/finance/campaigns/:id", authenticate, authorize("Super Admin"), updateCampaign);
route.delete("/finance/campaigns/:id", authenticate, authorize("Super Admin"), deleteCampaign);
/*****************************************************
                    BANNER API's
*******************************************************/

/**
 * @route /banner/add-banners
 * @description
 */
route.post("/banner/add-banner",authenticate,bannerUpload.single("banner_file"),addBanner);

/**
 * @route /banner/all-banners
 * @description
 */
route.get("/banner/all-banners",authenticate,authorize("Super Admin"), getAllBanners)



/**
 * @route /banner/update-banners/:id
 * @description
 */
route.patch("/banner/update-banners/:id", authenticate,bannerUpload.single("banner_file"), updateBanner)

/*****************************************************
                    CATEGORIES API's
*******************************************************/

/**
 * @route /categories/add-category
 * @description
 */
route.post("/categories/add-category",authenticate, upload.single("image"), addCategory);

/**
 * @route /categories/all-category
 * @description
 */
route.get("/categories/get-categories", authenticate, getCategories);

/**
 * @route /categories/get-category/:id
 * @description
 */
route.get("/categories/get-category/:id", authenticate, getCategoryById);


/**
 * @route /categories/update-category/:id
 * @description
 */
route.patch("/categories/update-category/:id", authenticate, upload.single("image"), updateCategory);

/**
 * @route /categories/delete-category/:id
 * @description
 */
route.delete("/categories/delete-category/:id", authenticate, deleteCategory);

/**
 * @route /categories/add-sub-category
 * @description
 */
route.post("/categories/add-sub-category", authenticate, uploadsub.single("sub_image"), addSubCategory);

/**
 * @route /categories/all-sub-category
 * @description
 */
route.get("/categories/get-sub-categories", authenticate, getAllSubCategories);

/**
 * @route /categories/get-sub-category/:id
 * @description
 */
route.get("/categories/get-sub-category/:idOrName", authenticate, getSubCategoryByIdOrName);


/**
 * @route /categories/update-sub-category/:id
 * @description
 */
route.put("/categories/update-sub-category/:id", authenticate, uploadsub.single("sub_image"), updateSubCategory);

/**
 * @route /categories/delete-sub-category/:id
 * @description
 */
route.delete("/categories/delete-sub-category/:id", authenticate, deleteSubCategory);

/*****************************************************
                    BLOG MANAGEMENT API's
*******************************************************/

/**
 * @route /blog/all-blogs
 * @description
 */
route.get("/blog/all-blogs", authenticate, getAllBlogs);

/**
 * @route /blog/add-new-blog
 * @description
 */
route.post("/blog/add-blog",authenticate,
  blogUpload.fields([
    { name: "feature_image", maxCount: 1 },
    { name: "additional_images", maxCount: 10 },
  ]),
  addBlog
);

/**
 * @route /blog/update-blog/:id
 * @description
 */
route.put("/blog/update-blog/:id",authenticate,
    blogUpload.fields([
    { name: "feature_image", maxCount: 1 },
    { name: "additional_images", maxCount: 10 },
  ]),
  updateBlog
);

/**
 * @route /blog/delete-blog/:id
 * @description
 */
route.delete("/blog/delete-blog/:id",authenticate,deleteBlog);


/*****************************************************
                    GYM ANALYTICS API's
*******************************************************/
/**
 * @route /gym/analytics/
 * @description
 */
route.get("/gym/analytics",authenticate,authorize("Super Admin"),getGymAnalytics);
route.get("/gym/analytics/export-summary",authenticate,authorize("Super Admin"),exportGymAnalyticsSummary);
route.get("/gym/analytics/export-with-filters",authenticate,authorize("Super Admin"),exportGymAnalyticsWithFilters);
route.get("/gym/analytics/export-state-analytics",authenticate,authorize("Super Admin"),exportStateAnalyticsCSV);

/*****************************************************
                    REPORT API's
*******************************************************/
/**
 * @route /gym/report
 * @description
 */

route.get(
  "/gym/report",
  authenticate,
  authorize("Super Admin", "Admin"),
  getReportsDashboard
);

route.get(
  "/gym/report/export",
  authenticate,
  authorize("Super Admin", "Admin"),
  exportReports
);

/*****************************************************
                    ADMINISTRATION API's
*******************************************************/

/**
 * @route /admin/user
 * @description
 */
/*****************************************************
ADMINISTRATION API's
*******************************************************/

/* ================= USER MANAGEMENT ================= */

route.post("/admin/Createusers", authenticate, authorize("Super Admin"), createUser);

route.get("/admin/Getusers", authenticate, authorize("Super Admin"), getUsers);

route.get("/admin/users/stats", authenticate, authorize("Super Admin"), getUserStats);

route.get("/admin/getusersById/:id", authenticate, authorize("Super Admin"), getUserById);

route.put("/admin/Updateusers/:id", authenticate, authorize("Super Admin"), updateUser);

route.patch("/admin/Toggleusers/:id", authenticate, authorize("Super Admin"), toggleUserBlock);

route.delete("/admin/Deleteusers/:id", authenticate, authorize("Super Admin"), deleteUser);

/* ================= ROLE MANAGEMENT ================= */

route.post("/admin/Createroles", authenticate, authorize("Super Admin"), createRole);

route.get("/admin/Getroles", authenticate, authorize("Super Admin"), getRoles);

route.put("/admin/Updateroles/:roleId", authenticate, authorize("Super Admin"), updateRole);

route.patch("/admin/Toggleroles/:roleId", authenticate, authorize("Super Admin"), toggleRoleStatus);

route.delete("/admin/Deleteroles/:roleId", authenticate, authorize("Super Admin"), deleteRole);

/* ================= ROLE PERMISSIONS ================= */

// Get all permissions with assigned true/false for selected role
route.get(
"/admin/GetrolesPermissions/:roleId",
authenticate,
authorize("Super Admin"),
getRolePermissions
);

// Update permissions of selected role
route.put(
"/admin/UpdaterolesPermissions/:roleId",
authenticate,
authorize("Super Admin"),
updateRolePermissions
);

// Get all permission master data
route.get(
"/admin/Getallpermissions",
authenticate,
authorize("Super Admin"),
getAllPermissions
);

/* ================= ROLE ASSIGNMENTS ================= */

// User list with role and permission count
route.get(
"/admin/Getrole-assignments",
authenticate,
authorize("Super Admin"),
getRoleAssignments
);

// Quick role change for a user
route.patch(
"/admin/Updateusers/:userId/role",
authenticate,
authorize("Super Admin"),
assignRoleToUser
);

// Get permissions inherited by one user
route.get(
"/admin/GetusersPermissions/:userId",
authenticate,
authorize("Super Admin"),
getUserPermissions
);

/**
 * @route /admin/auditTrial
 * @description Returns a paginated audit log of all admin actions.
 *              Supports optional filters: user_id, action, start_date, end_date, page, limit.
 */


route.get(
  "/admin/audit-trail/stats",
  authenticate,
  authorize("Super Admin"),
  getAuditStats
);

// Audit table with search, filters and pagination
route.get(
  "/admin/audit-trail",
  authenticate,
  authorize("Super Admin"),
  getAuditLogs
);

// Dropdown/filter data: actions, statuses and users
route.get(
  "/admin/audit-trail/filters",
  authenticate,
  authorize("Super Admin"),
  getAuditFilterOptions
);
/*****************************************************
                    SETTINGS API's
*******************************************************/
/**
 * @route /settings/email-setting
 * @description
 */


/**
 * @route /settings/communication-setting
 * @description
 */

/**
 * @route /settings/email-templates
 * @description
 */

/**
 * @route /settings/email-logs
 * @description
 */


module.exports = route