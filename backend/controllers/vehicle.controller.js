const vehicleService = require('../services/vehicle.service');

// Add new vehicle
async function addVehicle(req, res, next) {
    try {
        const vehicleData = req.body;
        const newVehicle = await vehicleService.addVehicle(vehicleData);
        res.status(201).json({
            success: true,
            data: newVehicle
        });
    } catch (error) {
        next(error);
    }
}

// Update vehicle by ID
async function updateVehicle(req, res, next) {
    try {
        const vehicleId = req.params.id;
        const vehicleData = req.body;
        const updatedVehicle = await vehicleService.updateVehicle(vehicleId, vehicleData);
        if (!updatedVehicle) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        } else {
            res.status(200).json({
                success: true,
                data: updatedVehicle
            });
        }
    } catch (error) {
        next(error);
    }
}

// Get single vehicle by ID
async function getVehicleById(req, res, next) {
    try {
        const vehicleId = req.params.id;
        const vehicle = await vehicleService.getVehicleById(vehicleId);
        if (!vehicle) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        } else {
            res.status(200).json({
                success: true,
                data: vehicle
            });
        }
    } catch (error) {
        next(error);
    }
}

// Get all vehicles for a customer by customer ID
async function getVehiclesByCustomerId(req, res, next) {
    try {
        const customerId = req.params.customer_id;
        const vehicles = await vehicleService.getVehiclesByCustomerId(customerId);
        res.status(200).json({
            success: true,
            data: vehicles
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addVehicle,
    updateVehicle,
    getVehicleById,
    getVehiclesByCustomerId
};