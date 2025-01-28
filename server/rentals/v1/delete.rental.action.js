const Property = require('../../properties/v1/propertyModel');
const Rental = require('./rentalModel');



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

module.exports = {deleteRental};