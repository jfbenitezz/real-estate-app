const Property = require('./property.model');
const Rental = require('../../rentals/v1/rental.model');

const deleteProperty = async (req, res) => {
    try {
      const { id } = req.params;
      let property = await Property.findById(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
  
      // Check if the authenticated user is the owner of the property
      if (property.owner.toString() !== req.userId) {
        return res.status(403).json({ error: "Access denied. You are not the owner of this property." });
      }
  
      // Find rentals associated with the property
      const rentals = await Rental.find({ property: id });
      const hasActiveRentals = rentals.some(rental => rental.status === 'Active');
      if (hasActiveRentals) {
        return res.status(400).json({ error: "Cannot delete property with active rentals" });
      }
  
      // Delete the property
      const deletedProperty = await Property.findByIdAndDelete(id);
      console.log('Property deleted:', deletedProperty);
      res.status(200).json(deletedProperty);
  
    } catch (error) {
      console.error(`Error deleting property: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {deleteProperty}