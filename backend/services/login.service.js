// Import the query function from the db.config.js file
const conn = require("../config/db.config");
// Import the bcrypt module to do the password comparison
const bcrypt = require("bcrypt");
// Import the employee service to get employee by email
const employeeService = require("./employee.service");

// Import the customer service to get by email
const customerService = require("./customer.service");

// Handle employee login
async function logIn(employeeData) {
  try {
    let returnData = {}; // Object to be returned
    const employee = await employeeService.getEmployeeByEmail(
      employeeData.employee_email
    );
    const customer = await customerService.getCustomerByEmail(
      employeeData.employee_email
    );
    if (employee && employee.length === 0) {
      returnData = {
        status: "fail",
        message: "Employee does not exist",
      };
    }
    if (customer && customer.length !== 0) {
      returnData = {
        status: "success",
        data: customer,
      };
      return returnData;
    }
    const passwordMatch = await bcrypt.compare(
      employeeData.employee_password,
      employee[0].employee_password_hashed
    );
    if (!passwordMatch) {
      returnData = {
        status: "fail",
        message: "Incorrect password",
      };
      return returnData;
    }
    returnData = {
      status: "success",
      data: employee[0],
    };
    return returnData;
  } catch (error) {
    console.error(error);
  }
}

// Export the function
module.exports = {
  logIn,
};