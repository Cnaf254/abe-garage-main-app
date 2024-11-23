// Import the login service
const loginService = require("../services/login.service");
// Import the jsonwebtoken module
const jwt = require("jsonwebtoken");
// Import the secret key from the environment variables
const jwtSecret = process.env.JWT_SECRET;

// Handle employee login
async function logIn(req, res, next) {
  try {
    const employeeData = req.body;
    // Call the logIn method from the login service
    const employee = await loginService.logIn(employeeData);
    // If the employee is not found
    if (employee.status === "fail") {
      res.status(403).json({
        status: employee.status,
        message: employee.message,
      });
    }
    // If successful, send a response to the client
    const payload = {
      employee_id: employee.data?.employee_id || employee.data?.customer_id,
      employee_email:
        employee.data?.employee_email || employee.data?.customer_email,
      employee_role: employee.data?.company_role_id || -1,
      employee_first_name:
        employee.data?.employee_first_name ||
        employee.data?.customer_first_name,
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "24h",
    });
    const sendBack = {
      employee_id: payload.employee_id,
      employee_email: payload.employee_email,
      employee_role: payload.employee_role,
      employee_token: token,
    };
    res.status(200).json({
      status: "success",
      message: "Employee logged in successfully",
      data: sendBack,
    });
  } catch (error) {}
}

// Export the functions
module.exports = {
  logIn,
};