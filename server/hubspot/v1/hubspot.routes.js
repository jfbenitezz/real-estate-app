const express = require('express');
const router = express.Router();
const { 
  exchangeForTokens, 
  getHubSpotToken, 
  refreshAccessToken, 
  getContact 
} = require('./hubspotAuth');

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = "http://localhost:5000/hubspot/callback";
const SCOPES = encodeURIComponent([
    'crm.dealsplits.read_write',
    'crm.objects.contacts.read',
    'crm.objects.contacts.write',
    'crm.objects.deals.read',
    'crm.objects.deals.write',
    'crm.schemas.deals.read',
    'crm.schemas.deals.write',
    'oauth'
  ].join(' '));

// 🛠 Step 1: Redirect User to HubSpot OAuth
router.get('/install', (req, res) => {
  const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
});

// 🛠 Step 2: Handle OAuth Callback & Store Token
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    const userId = '664d06159a568aa15c55f0f8';
    const accessToken = await exchangeForTokens(userId, { 
      grant_type: 'authorization_code', 
      client_id: CLIENT_ID, 
      redirect_uri: REDIRECT_URI, 
      client_secret: process.env.CLIENT_SECRET, 
      code 
    });

    res.send('OAuth flow complete! Token stored.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error exchanging code for token');
  }
});

router.get('/refresh-token/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    await refreshAccessToken(userId);
    res.send(`Token refreshed for user ${userId}`);
  } catch (err) {
    res.status(500).send(`Error refreshing token: ${err.message}`);
  }
});

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
    res.status(500).send('Error retrieving contact');
  }
});

module.exports = router;
