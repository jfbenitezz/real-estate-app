const request = require('request-promise-native');
const {readUser} = require('../../users/v1/read.user.action');
const User = require('../../users/v1/user.model');
const HUBSPOT_BASE_URL = 'https://api.hubapi.com';

const fieldTranslation = {
  contactInfo: 'phone', 

};

const translateToHubSpotFields = (dbFields) => {
  const translatedFields = {};
  
  for (const [key, value] of Object.entries(dbFields)) {
      const hubSpotKey = fieldTranslation[key] || key; 
      translatedFields[hubSpotKey] = value;
  }

  return translatedFields;
};


const getContact = async (accessToken, contactId = "") => { 
    
    try {
      const result = await request.get(`${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    
    const data = JSON.parse(result); 
    const contacts = Array.isArray(data.results) ? data.results : [data]; // Ensure it's always an array

    return contacts.map(({ id, properties, createdAt, updatedAt }) => ({
      id,
      email: properties?.email || null,
      firstname: properties?.firstname || null,
      lastname: properties?.lastname || null,
      createdAt,
      updatedAt
    }));

    } catch (e) {
      throw new Error(`Error getting contact: ${e.message}`);
    }
  };

  const axios = require('axios');


async function syncUserToHubSpot (access_token, userId) {
    const url = `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts`;
    try {
      const user = await readUser(userId);
      const contactData = {
        properties: {
            email: user.email,
            firstname: user.username,
            address: user.address || "",
            phone: user.contactInfo || ""
        }
      };
      const response = await axios.post(url, contactData, {
          headers: { Authorization: `Bearer ${access_token}` }
      });
              
      // Extract HubSpot Contact ID and Save in MongoDB
      const hubSpotId = response.data.id;  
      await User.findByIdAndUpdate(userId, { hubSpotId }, { new: true });
      console.log("User synced & updated with HubSpot ID:", hubSpotId);

        console.log("User synced successfully:", response.data);
        return response.data;
    } catch (e) {
      throw new Error(`Error creating contact: ${e.message}`);;
    }
  };

  async function updateUserInHubSpot(access_token, userId, updates) {
    const user = await readUser(userId);
    if (!user.hubSpotId) {
        throw new Error("HubSpot ID not found for user.");
    }

    const url = `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/${user.hubSpotId}`;
    console.log(url);

    try {
        const contactData = { properties: translateToHubSpotFields(updates) };

        console.log(`Updating HubSpot contact ${user.hubSpotId} for ${user.email}...`);

        const response = await axios.patch(url, contactData, {
            headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' }
        });

        console.log("User updated successfully:", response.data);
        return response.data;

    } catch (e) {
        throw new Error(`Error updating contact: ${e.message}`);
    }
}


  module.exports = { getContact, syncUserToHubSpot, updateUserInHubSpot };
