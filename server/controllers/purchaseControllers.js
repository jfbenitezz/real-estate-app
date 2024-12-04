const User = require('../models/userModel');
const Property = require('../models/propertyModel');
const Purchase = require('../models/purchaseModel');

const createPurchase = async (req, res) => {
    try {
      const { propertyId, purchasePrice, paymentTerms, financingDetails, closingDate, legalDocumentation, propertyInspection, closingCosts } = req.body;
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
        throw new Error('Property is not available for purchase');
      }
  
      // Create purchase record
      const newPurchase = new Purchase({
        buyer: userId,
        property: propertyId,
        purchasePrice,
        paymentTerms,
        financingDetails,
        closingDate,
        legalDocumentation,
        propertyInspection,
        closingCosts,
        // Other purchase fields if needed
      });
      await newPurchase.save();
  
      // Update property availability status
      property.availability = false;
      await property.save();
  
      console.log('Purchase created:', newPurchase);
      res.status(201).json({ success: true, message: 'Property purchased successfully', newPurchase });
  
    } catch (error) {
      console.error(`Error creating new purchase: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };

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
  

  module.exports = { createPurchase, readPurchase, updatePurchase, deletePurchase };