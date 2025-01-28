const Purchase = require('./purchaseModel');

  const readPurchase = async (req, res) => {
    try {
      const { id } = req.params;
      const targetPurchase = await Purchase.findById(id);
      if (!targetPurchase) {
        return res.status(404).json({ error: "Purchase not found" });
      }
      console.log('Purchase found:', targetPurchase);
      res.status(200).json(targetPurchase);
  
    } catch (error) {
      console.error(`Error reading purchase: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = { readPurchase };