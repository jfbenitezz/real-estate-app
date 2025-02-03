const express = require('express');
const router = express.Router();
const {getHubSpotToken} = require('./hubspotAuth.controller');
const {getContact} = require('./hubspotAPI.controller');

// 🛠 Get a Contact from HubSpot
router.get('/contact/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const accessToken = await getHubSpotToken(userId);
      if (!accessToken) {
        return res.status(401).send('No valid token found for user.');
      }
  
      const result = await getContact(accessToken);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error getting contact');
    }
  });

  module.exports = router;