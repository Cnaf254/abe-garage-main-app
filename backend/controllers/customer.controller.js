const customerService = require("../services/customer.service");

// Get all customers
async function getAllCustomers(req, res, next) {
  try {
    const sortby = req.query.sortby || "customer_added_date";
    const active_customer_status = req.query.active_customer_status || 1;
    const customers = await customerService.getAllCustomers(
      sortby,
      active_customer_status
    );
    res.status(200).json({
      customers,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to get customers!",
    });
  }
}

// Get a single customer by ID
async function getCustomerById(req, res, next) {
  try {
    const customerId = req.params.id;
    const customer = await customerService.getCustomerById(customerId);
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get customer!",
    });
  }
}

// Add a new customer
async function addCustomer(req, res, next) {
  try {
    const customerData = req.body;
    const customer = await customerService.addCustomer(customerData);
    res.status(200).json({
      success: "true",
      customer,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to add customer!",
    });
  }
}

// Update a customer by ID
async function updateCustomer(req, res, next) {
  try {
    const customerId = req.params.id;
    const customerData = req.body;
    const customer = await customerService.updateCustomer(
      customerId,
      customerData
    );
    res.status(200).json({
      success: "true",
      customer,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to update customer!",
    });
  }
}

// Customer Order Tracking
async function getCustomerOrders(req, res, next) {
  try {
    const customerId = req.params.id;
    const orders = await customerService.getCustomerOrders(customerId);
    res.status(200).json({
      status: "true",
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong!",
    });
  }
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  getCustomerOrders,
};