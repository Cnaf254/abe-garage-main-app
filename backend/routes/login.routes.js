// Import the express module  
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();
// Import the login controller 
const loginControllers = require("../controllers/login.controller");
// Create a route to handle the login request on post
router.post("/api/employee/login", loginControllers.logIn);
// Export the router
module.exports = router;