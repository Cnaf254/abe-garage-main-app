const express = require('express');
const router = express.Router();
const employeeRoutes = require('./employee.routes');
const customerRoutes = require('./customer.routes');
const orderRoutes = require('./order.routes');
const vehicleRoutes = require('./vehicle.routes');
const installRoutes = require('./install.routes');
const loginRoutes = require('./login.routes');
const serviceRoutes = require('./service.routes');  

router.use(employeeRoutes);
router.use(customerRoutes);
router.use(orderRoutes);
router.use(vehicleRoutes);
router.use(installRoutes);
router.use(loginRoutes);
router.use(serviceRoutes);  

module.exports = router;