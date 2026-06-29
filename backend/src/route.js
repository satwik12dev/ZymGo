require("dotenv").config()
const express = require("express")
const route = express()
const cors = require("cors")

const {Login} = require("./controller/login.controller") // Importing the login controller from the controller folder
const authenticate = require("./middleware/auth.middleware")
const { dashboard } = require("./controller/dashboard.controller")
const {LogOut} = require("./controller/logout.controller")
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



module.exports = route