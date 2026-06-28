require("dotenv").config()
const express = require("express")
const route = express()
const cors = require("cors")

const {Login} = require("./controller/login.controller") // Importing the login controller from the controller folder

route.use(express.json())
route.use(cors())
route.set("trust proxy", true),


/**
 * @route /admin/login
 * @description 
 */
route.post("/admin/login", Login);

module.exports = route