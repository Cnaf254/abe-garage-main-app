const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Get all services
router.get('/api/services', [authMiddleware.verifyToken], serviceController.getAllServices);

// Get a single service by ID
router.get('/api/service/:id', [authMiddleware.verifyToken], serviceController.getServiceById);

// Add a new service
router.post('/api/service', [authMiddleware.verifyToken, authMiddleware.isAdmin], serviceController.addService);

// Update an existing service
router.put('/api/service/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], serviceController.updateService);

module.exports = router;