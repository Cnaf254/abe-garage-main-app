const conn = require("../config/db.config");
const { v4: uuidv4 } = require("uuid");

// Get all orders with optional query parameters for limit, sort, and filter
async function getAllOrders(limit = 10, activeOrder = 1) {
  let query = `
        SELECT orders.*, order_info.order_total_price, order_info.estimated_completion_date, order_info.completion_date
        FROM orders
        LEFT JOIN order_info ON orders.order_id = order_info.order_id
        WHERE orders.active_order = ${activeOrder}
        ORDER BY order_date DESC LIMIT ${limit}
    `;
  const rows = await conn.query(query);
  return rows;
}

// Get single order by ID
async function getOrderById(orderId) {
  const query = "SELECT * FROM orders WHERE order_id = ?";
  const [rows] = await conn.query(query, [orderId]);
  if (rows.length === 0) return null;

  // Fetch order services
  const servicesQuery = "SELECT * FROM order_services WHERE order_id = ?";
  const [services] = await conn.query(servicesQuery, [orderId]);

  return {
    ...rows,
    order_services: services,
  };
}

// Add new order
async function addOrder(orderData) {
  // Use the uuid to do random Order hash
  const orderHash = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

  // Check if employee_id exists
  const employeeRows = await conn.query(
    "SELECT * FROM employee WHERE employee_id = ?",
    [orderData.employee_id]
  );
  if (employeeRows.length === 0) {
    throw new Error("Invalid employee_id");
  }

  // Check if customer_id exists
  const customerRows = await conn.query(
    "SELECT * FROM customer_identifier WHERE customer_id = ?",
    [orderData.customer_id]
  );
  if (customerRows.length === 0) {
    throw new Error("Invalid customer_id");
  }

  // Check if vehicle_id exists
  const vehicleRows = await conn.query(
    "SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?",
    [orderData.vehicle_id]
  );
  if (vehicleRows.length === 0) {
    throw new Error("Invalid vehicle_id");
  }
  const query =
    "INSERT INTO orders (employee_id, customer_id, vehicle_id, order_description, order_hash, active_order) VALUES (?, ?, ?, ?, ?, ?)";
  const result = await conn.query(query, [
    orderData.employee_id,
    orderData.customer_id,
    orderData.vehicle_id,
    orderData.order_description,
    orderHash,
    orderData.active_order,
  ]);
  const orderId = result.insertId;

  // Insert into order_info table
  const infoQuery =
    "INSERT INTO order_info (order_id, order_total_price, estimated_completion_date, completion_date, additional_request, notes_for_internal_use, notes_for_customer, additional_requests_completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  await conn.query(infoQuery, [
    orderId,
    orderData.order_total_price,
    orderData.estimated_completion_date || null,
    orderData.completion_date || null,
    orderData.additional_request || null,
    orderData.notes_for_internal_use || null,
    orderData.notes_for_customer || null,
    orderData.additional_requests_completed || 0,
  ]);

  // Add order services
  const servicesQuery =
    "INSERT INTO order_services (order_id, service_id , service_completed) VALUES (?, ? , ? )";
  const servicesData = await conn.query(servicesQuery, [
    orderId,
    orderData.service_id,
    orderData.service_completed,
  ]);

  return { order_id: orderId, ...orderData };
}

// Update existing order
async function updateOrder(orderId, orderData) {
  const query =
    "UPDATE orders SET employee_id = ?, customer_id = ?, vehicle_id = ?, order_description = ?, active_order = ? WHERE order_id = ?";
  const result = await conn.query(query, [
    orderData.employee_id,
    orderData.customer_id,
    orderData.vehicle_id,
    orderData.order_description,
    orderData.active_order,
    orderId,
  ]);

  // UPDATE into order_info table
  const infoQuery = `UPDATE order_info 
                   SET order_total_price = ?, 
                       estimated_completion_date = ?, 
                       completion_date = ?
                   WHERE order_id = ?`;
  await conn.query(infoQuery, [
    orderData.order_total_price,
    orderData.estimated_completion_date || new Date().toISOString(),
    orderData.completion_date || new Date().toISOString(),
    orderId,
  ]);

  if (result.affectedRows === 0 && infoQuery.affectedRows == 0) return null;

  return { order_id: rows.orderId, ...orderData };
}

// Delete an order
async function deleteOrder(orderId) {
  // Delete from order_services table first due to foreign key constraints
  await conn.query("DELETE FROM order_services WHERE order_id = ?", [orderId]);

  // Delete from order_info table
  await conn.query("DELETE FROM order_info WHERE order_id = ?", [orderId]);

  // Delete from orders table
  const result = await conn.query("DELETE FROM orders WHERE order_id = ?", [
    orderId,
  ]);

  if (result.affectedRows === 0) {
    throw new Error("Order not found");
  }

  return { message: "Order deleted successfully" };
}

module.exports = {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
};