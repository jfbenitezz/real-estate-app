const Rental = require('./rental.model');

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

  module.exports = {readRental};