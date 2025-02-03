const express = require('express');
const router = express.Router();
const {getHubSpotToken} = require('./hubspotAuth.controller');
const {getContact, syncUserToHubSpot, updateUserInHubSpot, createDeal} = require('./hubspotAPI.controller');

// 🛠 Get a Contact from HubSpot
router.get('/contact/', async (req, res) => {
    const { userId } = req.query;
    const {contactID} = req.query;
  
    try {
      const accessToken = await getHubSpotToken(userId);
      if (!accessToken) {
        return res.status(401).send('No valid token found for user.');
      }
  
      const result = await getContact(accessToken, contactID);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error getting contact');
    }
  });

  router.post('/syncToHubspot/', async (req, res) => {
    const { userId } = req.query;
    const {dbcontactID} = req.query;
  
    try {
      const accessToken = await getHubSpotToken(userId);
      if (!accessToken) {
        return res.status(401).send('No valid token found for user.');
      }
  
      const result = await syncUserToHubSpot(accessToken, dbcontactID);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error getting contact');
    }
  });

  router.patch('/updateHubspot/', async (req, res) => {
    const { userId } = req.query;
    const {dbcontactID} = req.query;
  
    try {
      const accessToken = await getHubSpotToken(userId);
      if (!accessToken) {
        return res.status(401).send('No valid token found for user.');
      }
  
      const result = await updateUserInHubSpot(accessToken, dbcontactID, req.body);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error getting contact');
    }
  });

  router.post('/createDeal/', async (req, res) => {
    const { userId } = req.query;
  
    try {
      const accessToken = await getHubSpotToken(userId);
      if (!accessToken) {
        return res.status(401).send('No valid token found for user.');
      }
  
      const result = await createDeal(accessToken, req.body.userId, req.body.propertyId);
      res.json(`Deal created by ${req.body.userId} for property ${req.body.propertyId}`);
      res.status(200);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error getting contact');
    }
  });

  module.exports = router;