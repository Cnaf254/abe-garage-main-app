// Import the dotenv package
require('dotenv').config();
// Import the jsonwebtoken package
const jwt = require("jsonwebtoken");
// Import the employee service 
const employeeService = require("../services/employee.service");

// A function to verify the token received from the frontend 
const verifyToken = async (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).send({
      status: "fail",
      message: "No token provided!"
    });
  }

  // Split the token from the "Bearer " prefix
  const token = authHeader.split(' ')[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized!"
      });
    }
    req.employee_email = decoded.employee_email;
    next();
  });
}

// A function to check if the user is an admin
const isAdmin = async (req, res, next) => {
  const employee_email = req.employee_email;
  const employee = await employeeService.getEmployeeByEmail(employee_email);
  if (employee.length > 0 && employee[0].company_role_id === 3) {
    next();
  } else {
    return res.status(403).send({
      status: "fail",
      message: "Not an Admin!"
    });
  }
}

const authMiddleware = {
  verifyToken,
  isAdmin
}

module.exports = authMiddleware;