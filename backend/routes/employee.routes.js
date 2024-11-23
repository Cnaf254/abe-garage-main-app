const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// Create a route to handle the add employee request on post
router.post("/api/employee", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.createEmployee);

// Create a route to handle the get all employees request on get
router.get("/api/employees", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.getAllEmployees);

// Create a route to handle the get employee by id request on get
router.get("/api/employee/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.getEmployeeById);

// Create a route to handle the update employee by id request on put
router.put("/api/employee/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.updateEmployee);

// Export the router
module.exports = router;