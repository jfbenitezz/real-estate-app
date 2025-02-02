const Property = require('./property.model');
const Rental = require('../../rentals/v1/rental.model');

const deleteProperty = async ( id, userId ) => {
    try {
      let property = await Property.findById(id);
      if (!property) {
        throw Error("Property not found");
      }
  
      // Check if the authenticated user is the owner of the property
      if (property.owner.toString() !== userId) {
        throw Error("Access denied. You are not the owner of this property.");
      }
  
      // Find rentals associated with the property
      const rentals = await Rental.find({ property: id });
      const hasActiveRentals = rentals.some(rental => rental.status === 'Active');
      if (hasActiveRentals) {
        throw Error("Cannot delete property with active rentals");
      }
  
      // Delete the property
      const deletedProperty = await Property.findByIdAndDelete(id);
      return { status: 200, data: deletedProperty };
  
    } catch (error) {
      console.error(`Error deleting property: ${error.message}`);
      throw Error(error.message);
    }
  };

  module.exports = {deleteProperty}