const { query } = require('../config/db.config');
const bcrypt = require('bcrypt');

async function checkIfEmployeeExists(email) {
  const rows = await query("SELECT * FROM employee WHERE employee_email = ?", [email]);
  return rows.length > 0;
}

async function createEmployee(employee) {
  let createdEmployee = {};
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.employee_password, salt);
    const rows = await query("INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)", [employee.employee_email, employee.active_employee]);
    if (rows.affectedRows !== 1) {
      return false;
    }
    const employee_id = rows.insertId;
    await query("INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)", [employee_id, employee.employee_first_name, employee.employee_last_name, employee.employee_phone]);
    await query("INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)", [employee_id, hashedPassword]);
    await query("INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)", [employee_id, employee.company_role_id]);
    createdEmployee = { employee_id: employee_id };
  } catch (err) {
    console.error(err);
  }
  return createdEmployee;
}

async function getEmployeeByEmail(employee_email) {
  const rows = await query("SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?", [employee_email]);
  return rows;
}

async function getAllEmployees(active_employee = 1) { 
  const queryStr = `
    SELECT * FROM employee
    INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id
    INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id
    INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id
    WHERE employee.active_employee = ?
    ORDER BY employee.employee_id DESC
  `;
  const rows = await query(queryStr, [active_employee]);
  return rows;
}


async function getEmployeeById(id) {
  const rows = await query("SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_id = ?", [id]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
}

// Update an existing employee
async function updateEmployee(id, employeeData) {
  const  { 
  employee_first_name,
  employee_last_name ,
  employee_phone ,
  active_employee,
  company_role_id } = employeeData
  await query("UPDATE employee_info SET employee_first_name = ?, employee_last_name = ?, employee_phone = ? WHERE employee_id = ?", [employee_first_name, employee_last_name, employee_phone, id]);
  await query("UPDATE employee_role SET company_role_id = ? WHERE employee_id = ?", [company_role_id, id]);
  await query("UPDATE employee SET  active_employee = ? WHERE employee_id = ?", [ active_employee, id]);
  return await getAllEmployees(1);
}

// Export the functions for use in the controller
module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  getAllEmployees,
  getEmployeeById,
  updateEmployee
};