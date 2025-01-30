const Rental = require('./rental.model');


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
  
  module.exports = {updateRental};