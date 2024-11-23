const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// Add a new vehicle
router.post("/api/vehicle", [authMiddleware.verifyToken, authMiddleware.isAdmin], vehicleController.addVehicle);

// Update a vehicle by ID
router.put("/api/vehicle/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], vehicleController.updateVehicle);

// Get a single vehicle by ID
router.get("/api/vehicle/:id", [authMiddleware.verifyToken], vehicleController.getVehicleById);

// Get all vehicles for a customer by customer ID
router.get("/api/vehicles/:customer_id", [authMiddleware.verifyToken], vehicleController.getVehiclesByCustomerId);

module.exports = router;