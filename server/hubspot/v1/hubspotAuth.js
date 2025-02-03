const request = require('request-promise-native');
const { Token } = require('./hubspotToken.model.js');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/hubspot/callback";

const exchangeForTokens = async (userId, exchangeProof) => {
  try {
    const responseBody = await request.post('https://api.hubapi.com/oauth/v1/token', {
      form: exchangeProof
    });

    const tokens = JSON.parse(responseBody);

    const tokenDoc = new Token({
      userId: userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000), // Fixed naming
      hubSpotAppId: CLIENT_ID
    });

    await tokenDoc.save();
    return tokens.access_token;
  } catch (e) {
    console.error(`Error exchanging token: ${e.message}`);
    return null;
  }
};

const getHubSpotToken = async (userId) => {
    const tokenDoc = await Token.findOne({ userId })
      .sort({ createdAt: -1 }) 
      .exec();
  
    if (!tokenDoc) {
      return null;
    }
  
    const now = Date.now();
    const expiresInMs = tokenDoc.expiresAt - now;
  
    if (expiresInMs > 3 * 60 * 1000) { 
      return tokenDoc.accessToken;
    }
  
    // Token is close to expiring (or expired), refresh it
    console.log(`Token for user ${userId} is expiring soon. Refreshing...`);
    return await refreshAccessToken(userId);
  };
  

const refreshAccessToken = async (userId) => {
  const tokenDoc = await Token.findOne({ userId });

  if (!tokenDoc) {
    throw new Error('No token found for user');
  }

  const refreshTokenProof = {
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    refresh_token: tokenDoc.refreshToken
  };

  try {
    const responseBody = await request.post('https://api.hubapi.com/oauth/v1/token', {
      form: refreshTokenProof
    });
    const tokens = JSON.parse(responseBody);

    tokenDoc.accessToken = tokens.access_token;
    tokenDoc.refreshToken = tokens.refresh_token;
    tokenDoc.expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
    await tokenDoc.save();

    console.log('Token refreshed');
    return tokens.access_token; 
  } catch (e) {
    console.error('Error refreshing token');
    throw new Error('Failed to refresh token');
  }
};

const getContact = async (accessToken, count = 10) => { 
  try {
    const result = await request.get(`https://api.hubapi.com/contacts/v1/lists/all/contacts/all?count=${count}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return JSON.parse(result).contacts;
  } catch (e) {
    throw new Error('Error retrieving contact');
  }
};

module.exports = { exchangeForTokens, getHubSpotToken, refreshAccessToken, getContact };
