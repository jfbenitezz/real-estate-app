const request = require('request-promise-native');
const {readProperty} = require('../../properties/v1/read.property.action');
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

const createDeal = async (access_token, userId, propertyId) => { 
  try {
    // Fetch user details
    const user = await readUser(userId);

    // Fetch property details, including the owner
    const { status, data: propertyData } = await readProperty(propertyId);

    // Check if owner's HubSpot ID exists
    let propertyOwnerhubSpotId = null;
    let propertyOwner = null; 
    let propertyOwnerName = null;
    
    if (propertyData.owner) {
      propertyOwner = await readUser(propertyData.owner);
      
      if (propertyOwner) { // Ensure the user was found
        propertyOwnerhubSpotId = propertyOwner.hubSpotId || null;
        propertyOwnerName = propertyOwner.username || null;
      }
    }
    
    
    if (!propertyOwnerhubSpotId) {
      throw new Error('Property owner does not have a HubSpot ID');
    }

    // Construct deal data for HubSpot API
    const dealRequest = {
      associations: {
        associatedCompanyIds:'29491125047', // Set  associated company ID
        associatedVids: [user?.hubSpotId], 
      },
      properties: [
        {
          value: `${propertyData?.title} Deal`, // Dynamically use property title as deal name
          name: 'dealname'
        },
        {
          value: 'appointmentscheduled', 
          name: 'dealstage'
        },
        {
          value: 'default', 
          name: 'pipeline'
        },
        {
          value: (propertyData?.price?.amount || 0).toString(), 
          name: 'amount'
        },
        {
          value: 'newbusiness',
          name: 'dealtype'
        },
        {
          value: propertyData?._id.toString(), 
          name: 'property_id' 
        },
        {
          value: propertyOwnerName, 
          name: 'property_owner_name' 
        }
      ]
    };
    console.log(dealRequest);

    // Make API request to HubSpot to create the deal
    const response = await axios.post(
      'https://api.hubapi.com/deals/v1/deal',
      dealRequest,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Deal created successfully:', response.data);
  } catch (error) {
    console.error('Error creating deal:', error.message);
  }
};

 module.exports = { getContact, syncUserToHubSpot, updateUserInHubSpot, createDeal };
