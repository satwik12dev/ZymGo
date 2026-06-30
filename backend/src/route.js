require("dotenv").config()
const express = require("express")
const route = express()
const cors = require("cors")

const {Login}  = require("./controller/login.controller") // Importing the login controller from the controller folder
const authenticate = require("./middleware/auth.middleware")
const { dashboard } = require("./controller/dashboard.controller")
const {LogOut} = require("./controller/logout.controller")

const {getGymList} = require("./controller/gymlist.controller")
const {getMemberList} = require("./controller/memberlist.controller")
const { addGym } = require("./controller/AddGym.controller")

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
route.get( "/members/list", authenticate, getMemberList);

/**
 * @route /gym/gym-list
 * @description
 */
route.get("/gym/gym-list", authenticate, getGymList)

/**
 * @route /gym/add-gym
 * @description
 */
route.post("/gym/add-gym", authenticate, addGym)


/**
 * @route /gym/performance
 * @description
 */


/**
 * @route /gym/bulk-add-gym
 * @description 
 */


/**
 * @route /gym/subscription-plans
 * @description
 */


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