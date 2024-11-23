const conn = require("../config/db.config");

// Add new vehicle
async function addVehicle(vehicleData) {
    const query = "INSERT INTO customer_vehicle_info (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const result = await conn.query(query, [
        vehicleData.customer_id,
        vehicleData.vehicle_year,
        vehicleData.vehicle_make,
        vehicleData.vehicle_model,
        vehicleData.vehicle_type,
        vehicleData.vehicle_mileage,
        vehicleData.vehicle_tag,
        vehicleData.vehicle_serial,
        vehicleData.vehicle_color
    ]);
    return { vehicle_id: result.insertId, ...vehicleData };
}

// Update vehicle by ID
async function updateVehicle(vehicleId, vehicleData) {
    const query = "UPDATE customer_vehicle_info SET customer_id = ?, vehicle_year = ?, vehicle_make = ?, vehicle_model = ?, vehicle_type = ?, vehicle_mileage = ?, vehicle_tag = ?, vehicle_serial = ?, vehicle_color = ? WHERE vehicle_id = ?";
    const result = await conn.query(query, [
        vehicleData.customer_id,
        vehicleData.vehicle_year,
        vehicleData.vehicle_make,
        vehicleData.vehicle_model,
        vehicleData.vehicle_type,
        vehicleData.vehicle_mileage,
        vehicleData.vehicle_tag,
        vehicleData.vehicle_serial,
        vehicleData.vehicle_color,
        vehicleId
    ]);
    if (result.affectedRows === 0) {
        return null;
    }
    return { vehicle_id: vehicleId, ...vehicleData };
}

// Get single vehicle by ID
async function getVehicleById(vehicleId) {
    const query = "SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?";
    const [rows] = await conn.query(query, [vehicleId]);
    return rows;
}

// Get all vehicles for a customer by customer ID
async function getVehiclesByCustomerId(customerId) {
    const query = "SELECT * FROM customer_vehicle_info WHERE customer_id = ?";
    const rows = await conn.query(query, [customerId]);
    return rows;
}

module.exports = {
    addVehicle,
    updateVehicle,
    getVehicleById,
    getVehiclesByCustomerId
};