const employeeService = require('../services/employee.service');

// Create the add employee controller
async function createEmployee(req, res, next) {
  const employeeExists = await employeeService.checkIfEmployeeExists(req.body.employee_email);
  if (employeeExists) {
    res.status(400).json({
      error: "This email address is already associated with another employee!"
    });
  } else {
    try {
      const employeeData = req.body;
      const employee = await employeeService.createEmployee(employeeData);
      if (!employee) {
        res.status(400).json({
          error: "Failed to add the employee!"
        });
      } else {
        res.status(200).json({
          status: "true",
        });
      }
    } catch (error) {
      res.status(400).json({
        error: "Something went wrong!"
      });
    }
  }
}

// Create the getAllEmployees controller 
async function getAllEmployees(req, res, next) { 
const { active_employee } = req.query;
  const employees = await employeeService.getAllEmployees(active_employee);
  if (!employees) {
    res.status(400).json({
      error: "Failed to get all employees!"
    });
  } else {
    res.status(200).json({
      status: "success",
      data: employees,
    });
  }
}

// Create the getEmployeeById controller
async function getEmployeeById(req, res, next) {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    if (!employee) {
      res.status(404).json({
        error: "Employee not found!"
      });
    } else {
      res.status(200).json({
        status: "success",
        data: employee,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong!"
    });
  }
}

// Create the updateEmployee controller
async function updateEmployee(req, res, next) {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body);
    if (!employee) {
      res.status(400).json({
        error: "Failed to update the employee!"
      });
    } else {
      res.status(200).json({
        status: "true",
        data: employee
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong!"
    });
  }
}

// Export the controllers
module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee
};