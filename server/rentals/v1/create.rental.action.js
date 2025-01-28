const User = require('../../users/v1/userModel');
const Property = require('../../properties/v1/propertyModel');
const Rental = require('./rentalModel');

const createRental = async (req, res) => {
    try {
      const { propertyId, startDate, durationMonths } = req.body;
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
        throw new Error('Property is not available for rent');
      }
  
      // Create rental record
      const newRental = new Rental({
        user: userId,
        property: propertyId,
        startDate : startDate,
        durationMonths: durationMonths,
        // Other rental fields if needed
      });
      await newRental.save();
  
      // Update property availability status
      property.availability = false; 
      await property.save();

      console.log('Rental created:', newRental);
      res.status(201).json({ success: true, message: 'Property rented successfully', newRental });
  
    } catch (error) {
      console.error(`Error creating new rental: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {createRental};