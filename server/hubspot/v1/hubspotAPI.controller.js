const request = require('request-promise-native');

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
      console.error(`Error getting contact: ${e.message}`);
    }
  };

  module.exports = { getContact };