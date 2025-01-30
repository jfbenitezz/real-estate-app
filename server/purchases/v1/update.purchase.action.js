const Purchase = require('./purchase.model');

const updatePurchase = async (req, res) => {
    try {
      const { id } = req.params; 
      const updateFields = req.body;
  
      let purchase = await Purchase.findById(id);
  
      if (!purchase) {
        return res.status(404).json({ error: "Purchase not found" });
      }
  
      // Check if the authenticated user is the owner of the purchase
      if (purchase.buyer.toString() !== req.userId) {
        return res.status(403).json({ error: "Access denied. You are not the owner of this purchase." });
      }
  
      // Update specific fields
      for (let field in updateFields) {
        if (updateFields.hasOwnProperty(field)) {
          purchase[field] = updateFields[field];
        }
      }
      
      // Save the updated purchase
      purchase = await purchase.save();
  
      console.log('Purchase updated:', purchase);
      res.status(200).json(purchase);
    } catch (error) {
      console.error(`Error updating purchase: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {updatePurchase};