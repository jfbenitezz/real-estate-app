const User = require('../../users/v1/user.model');
const Property = require('../../properties/v1/property.model');
const Purchase = require('./purchase.model');

const createPurchase = async (req, res) => {
    try {
      const { propertyId, purchasePrice, paymentTerms, financingDetails, closingDate, legalDocumentation, propertyInspection, closingCosts } = req.body;
      const userId = req.userId;
  
      // Fetch user and property details
      const user = await User.findById(userId);
      const property = await Property.findById(propertyId);
  
      // Verify user and property exist
      if (!user || !property) {
        throw new Error('User or property not found');
      }
  
      // Check property availability
      if (!property.availability) {
        throw new Error('Property is not available for purchase');
      }
  
      // Create purchase record
      const newPurchase = new Purchase({
        buyer: userId,
        property: propertyId,
        purchasePrice,
        paymentTerms,
        financingDetails,
        closingDate,
        legalDocumentation,
        propertyInspection,
        closingCosts,
        // Other purchase fields if needed
      });
      await newPurchase.save();
  
      // Update property availability status
      property.availability = false;
      await property.save();
  
      console.log('Purchase created:', newPurchase);
      res.status(201).json({ success: true, message: 'Property purchased successfully', newPurchase });
  
    } catch (error) {
      console.error(`Error creating new purchase: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {createPurchase};