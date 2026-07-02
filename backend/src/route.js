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


const {getAllSubscriptionPlans} = require("./controller/Subscription/subscriptionPlan.controller")
const addSubscriptionPlan = require("./controller/Subscription/AddPlans.controller")
const editSubscriptionPlan = require("./controller/Subscription/EditSubscriptionPlan.controller")
const deleteSubscriptionPlan = require("./controller/Subscription/DeletePLans.controller")

const authorize = require("./middleware/roles.middleware")
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


/*****************************************************
                    FINANCE API's
*******************************************************/

/**
 * @route /finance/invoices
 * @description
 */

/**
 * @route /finance/reports
 * @description
 */


/**
 * @route /finance/payments
 * @description
 */


/**
 * @route /finance/campaigns
 * @description
 */

/*****************************************************
                    BANNER API's
*******************************************************/

/**
 * @route /banner/all-banners
 * @description
 */


/**
 * @route /banner/add-banners
 * @description
 */

/**
 * @route /banner/update-banners
 * @description
 */


/*****************************************************
                    CATEGORIES API's
*******************************************************/

/**
 * @route /categories/add-category
 * @description
 */

/**
 * @route /categories/all-category
 * @description
 */

/**
 * @route /categories/add-sub-category
 * @description
 */

/**
 * @route /categories/all-sub-category
 * @description
 */


/*****************************************************
                    BLOG MANAGEMENT API's
*******************************************************/

/**
 * @route /blog/all-blogs
 * @description
 */


/**
 * @route /blog/add-new-blog
 * @description
 */

/*****************************************************
                    GYM ANALYTICS API's
*******************************************************/
/**
 * @route /gym/analytics/
 * @description
 */



/*****************************************************
                    REPORT API's
*******************************************************/
/**
 * @route /gym/report
 * @description
 */

/*****************************************************
                    ADMINISTRATION API's
*******************************************************/

/**
 * @route /admin/users
 * @description
 */

/**
 * @route /admin/roles&permissions
 * @description
 */

/**
 * @route /admin/auditTrial
 * @description Returns a paginated audit log of all admin actions.
 *              Supports optional filters: user_id, action, start_date, end_date, page, limit.
 */


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