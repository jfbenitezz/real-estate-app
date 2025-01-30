const Property = require('./property.model');

const updateProperty = async (req, res) => {
    try {
      const { id } = req.params; 
      const updateFields = req.body;
  
      let property = await Property.findById(id);
  
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      // Check if the user is the owner of the property
      if (property.owner.toString() !== req.userId) {
        return res.status(403).json({ error: "Access denied. You are not the owner of this property." });
      }
  
      // Update specific fields
      for (let field in updateFields) {
        if (updateFields.hasOwnProperty(field)) {
          property[field] = updateFields[field];
        }
      }
      // Save the updated user
      property = await property.save();
  
      console.log('Property updated:', property);
      res.status(200).json(property);
    } catch (error) {
      console.error(`Error updating property: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {updateProperty};