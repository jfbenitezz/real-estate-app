const User = require('../models/userModel');
const Property = require('../properties/v1/propertyModel');
const Rental = require('../models/rentalModel');

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

  const readRental = async (req, res) => {
    try {
      const { id } = req.params;
      const targetRental = await Rental.findById(id);
      if (!targetRental) {
        return res.status(404).json({ error: "Rental not found" });
      }
      console.log('Rental found:', targetRental);
      res.status(200).json(targetRental);
  
    } catch (error) {
      console.error(`Error reading rental: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  const updateRental = async (req, res) => {
    try {
      const { id } = req.params; 
      const updateFields = req.body;
  
      let rental = await Rental.findById(id);
  
      if (!rental) {
        return res.status(404).json({ error: "Rental not found" });
      }

      // Check if the authenticated user is the owner of the rental
      if (rental.user.toString() !== req.userId) {
        return res.status(403).json({ error: "Access denied. You are not the owner of this rental." });
      }
  
      // Update specific fields
      for (let field in updateFields) {
        if (updateFields.hasOwnProperty(field)) {
          rental[field] = updateFields[field];
        }
      }
      // Save the updated user
      rental = await rental.save();
  
      console.log('rental updated:', rental);
      res.status(200).json(rental);
    } catch (error) {
      console.error(`Error updating rental: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };
  

  const deleteRental = async (req, res) => {
    try {
      const { id } = req.params;
      const rental = await Rental.findById(id);
      if (!rental) {
        return res.status(404).json({ error: "Rental not found" });
      }

      // Check if the authenticated user is the one who rented the property
      if (rental.user.toString() !== req.userId) {
        return res.status(403).json({ error: "Access denied. You are not the renter of this property." });
      }

      // Update property availability status
      const propertyId = rental.property;
      const property = await Property.findById(propertyId);
      if (property) {
        property.availability = true;
        await property.save();
      }

      // Delete the rental
      await Rental.findByIdAndDelete(id);

      console.log('Rental deleted:', rental);
      res.status(200).json(rental);
    } catch (error) {
      console.error(`Error deleting rental: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createRental, readRental, updateRental, deleteRental
};

