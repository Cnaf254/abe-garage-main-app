const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Get all customers
router.get(
  "/api/customers",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.getAllCustomers
);

// Get a single customer by ID
router.get(
  "/api/customer/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.getCustomerById
);

// Add a new customer
router.post(
  "/api/customer",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.addCustomer
);

// Update a customer by ID
router.put(
  "/api/customer/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.updateCustomer
);

// Customers Order tracking
router.get("/api/customer/:id/orders", customerController.getCustomerOrders);

module.exports = router;