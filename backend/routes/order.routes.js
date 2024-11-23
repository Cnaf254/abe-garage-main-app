const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// Get all orders
router.get('/api/orders', [authMiddleware.verifyToken, authMiddleware.isAdmin], orderController.getAllOrders);

// Get single order by ID
router.get('/api/order/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], orderController.getOrderById);

// Add new order
router.post('/api/order', [authMiddleware.verifyToken, authMiddleware.isAdmin], orderController.addOrder);

// Update existing order
router.put('/api/order/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], orderController.updateOrder);

// Delete order
router.delete('/api/order/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, orderController.deleteOrder);

module.exports = router;