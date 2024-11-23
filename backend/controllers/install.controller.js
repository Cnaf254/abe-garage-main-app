// Import the install service to handle communication with the database
const installService = require('../services/install.service');
// Create a function to handle the install request 
async function install(req, res, next) {
  // Call the install service to create the database tables 
  const installMessage = await installService.install();
  // Check if the install was successful or not and send the appropriate response to the client
  if (installMessage.status === 200) {
    // If successful, send a response to the client 
    res.status(200).json({
      message: installMessage
    });
  } else {
    // If unsuccessful, send a response to the client 
    res.status(500).json({
      message: installMessage
    });
  }
}
// Export the install function
module.exports = { install };
