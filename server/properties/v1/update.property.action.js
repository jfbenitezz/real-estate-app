const Property = require('./property.model');

const updateProperty = async (id, updateFields, userId) => {
    try {
      let property = await Property.findById(id);
  
      if (!property) {
        throw new Error("Property not found");
      }

      // Check if the user is the owner of the property
      if (property.owner.toString() !== userId) {
        throw new Error("Access denied. You are not the owner of this property.");
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
      return property;
    } catch (error) {
      console.error(`Error updating property: ${error.message}`);
      throw error;
    }
  };

  module.exports = {updateProperty};