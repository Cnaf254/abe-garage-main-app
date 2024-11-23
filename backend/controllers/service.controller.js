// Import the service service
const serviceService = require('../services/service.service');

// Get all services
async function getAllServices(req, res) {
  try {
    const showInactive = req.query.showInactive || 1;
    const services = await serviceService.getAllServices(showInactive);
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get services' });
  }
} 
// Get a single service by ID
async function getServiceById(req, res) {
  const serviceId = req.params.id;
  try {
    const service = await serviceService.getServiceById(serviceId);
    if (service) {
      res.status(200).json(service);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to get service' });
  }
}

// Add a new service
async function addService(req, res) {
  const serviceData = req.body;
  try {
    const newService = await serviceService.addService(serviceData);
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add service' });
  }
}

// Update an existing service
async function updateService(req, res) {
  const serviceId = req.params.id;
  const serviceData = req.body;
  try {
    const updatedService = await serviceService.updateService(serviceId, serviceData);
    if (updatedService) {
      res.status(200).json(updatedService);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
}

module.exports = {
  getAllServices,
  getServiceById,
  addService,
  updateService
};