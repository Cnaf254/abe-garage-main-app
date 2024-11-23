const orderService = require("../services/order.service");

// Get all orders with optional query parameters for limit, sort, and filter
async function getAllOrders(req, res) {
  try {
    const { limit, activeOrder } = req.query;
    const orders = await orderService.getAllOrders(
      limit,
      parseInt(activeOrder)
    );
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

// Get single order by ID
async function getOrderById(req, res) {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);
    if (order) {
      res.status(200).json({
        status: "success",
        data: order,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

// Add new order
async function addOrder(req, res) {
  try {
    const orderData = req.body;
    const newOrder = await orderService.addOrder(orderData);
    res.status(201).json({
      status: "success",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

// Update existing order
async function updateOrder(req, res) {
  try {
    const orderId = req.params.id;
    const orderData = req.body;
    const updatedOrder = await orderService.updateOrder(orderId, orderData);
    if (updatedOrder) {
      res.status(200).json({
        status: "success",
        data: updatedOrder,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

async function deleteOrder(req, res) {
  try {
    const orderId = req.params.id;
    const result = await orderService.deleteOrder(orderId);
    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
};