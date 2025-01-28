const Property = require('../../properties/v1/propertyModel');
const Purchase = require('./purchaseModel');
  
  const deletePurchase = async (req, res) => {
    try {
      const { id } = req.params;
      const purchase = await Purchase.findById(id);
      if (!purchase) {
        return res.status(404).json({ error: "Purchase not found" });
      }
  
      // Check if the authenticated user is the one who bought the property
      if (purchase.buyer.toString() !== req.userId) {
        return res.status(403).json({ error: "Access denied. You are not the buyer of this property." });
      }
  
      // Update property availability status
      const propertyId = purchase.property;
      const property = await Property.findById(propertyId);
      if (property) {
        property.availability = true;
        await property.save();
      }
  
      // Delete the purchase
      await Purchase.findByIdAndDelete(id);
  
      console.log('Purchase deleted:', purchase);
      res.status(200).json(purchase);
    } catch (error) {
      console.error(`Error deleting purchase: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };
  

  module.exports = { deletePurchase };