const conn = require("../config/db.config");
const { v4: uuidv4 } = require("uuid");

// Get all customers
async function getAllCustomers(sortby, active_customer_status) {
  let query =
    "SELECT * FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id";
  const params = [];

  if (active_customer_status !== undefined && active_customer_status !== null) {
    query += " WHERE customer_info.active_customer_status = ?";
    params.push(active_customer_status);
  }

  if (sortby) {
    query += ` ORDER BY ${sortby} DESC`;
  }

  const rows = await conn.query(query, params);
  return rows;
}

// Get a single customer by ID
async function getCustomerById(customerId) {
  const query =
    "SELECT * FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id WHERE customer_identifier.customer_id = ?";
  const [rows] = await conn.query(query, [customerId]);
  return rows;
}

// Get a single customer by Email
async function getCustomerByEmail(customerEmail) {
  const query =
    "SELECT * FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id WHERE customer_identifier.customer_email = ?";
  const [rows] = await conn.query(query, [customerEmail]);
  return rows;
}

// Add a new customer
async function addCustomer(customerData) {
  // Use the uuid to do random customer hash
  const customerHash = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
  const query =
    "INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES (?, ?, ?)";
  const result = await conn.query(query, [
    customerData.customer_email,
    customerData.customer_phone_number,
    customerHash,
  ]);
  const customerId = result.insertId;
  const query2 =
    "INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) VALUES (?, ?, ?, ?)";
  await conn.query(query2, [
    customerId,
    customerData.customer_first_name,
    customerData.customer_last_name,
    customerData.active_customer_status,
  ]);
  return { customer_id: customerId, ...customerData };
}

// Update an existing customer
async function updateCustomer(customerId, customerData) {
  const customerIdentifier = await getCustomerById(customerId);
  let result = null;
  const query =
    "UPDATE customer_identifier SET customer_email = ?, customer_phone_number = ? WHERE customer_id = ?";
  result = await conn.query(query, [
    customerData.customer_email != customerIdentifier.customer_email
      ? customerData.customer_email
      : customerIdentifier.customer_email,
    customerData.customer_phone_number !=
    customerIdentifier.customer_phone_number
      ? customerData.customer_phone_number
      : customerIdentifier.customer_phone_number,
    customerId,
  ]);
  const query2 =
    "UPDATE customer_info SET customer_first_name = ?, customer_last_name = ?, active_customer_status = ? WHERE customer_id = ?";
  await conn.query(query2, [
    customerData.customer_first_name,
    customerData.customer_last_name,
    customerData.active_customer_status,
    customerId,
  ]);
  if (result.affectedRows === 0) {
    return null;
  }
  return { customer_id: customerId, ...customerData };
}

// Customer Order tracking
async function getCustomerOrders(customerId) {
  const query = `
    SELECT o.*, oi.estimated_completion_date, oi.completion_date
    FROM orders o
    INNER JOIN order_info oi ON o.order_id = oi.order_id
    WHERE o.customer_id = ?
    ORDER BY o.order_date DESC
  `;
  const rows = await conn.query(query, [customerId]);
  return rows;
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  getCustomerByEmail,
  getCustomerOrders,
};