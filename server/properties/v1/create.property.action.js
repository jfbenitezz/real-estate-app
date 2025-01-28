const Property = require('./propertyModel');
const createProperty = async (req, res) => {
    try {
      const newProperty = new Property({
        ...req.body,
        owner: req.userId
      });
  
      await newProperty.save();
      console.log('Property created:', newProperty);
      res.status(201).json(newProperty);
    } catch (error) {
      console.error(`Error saving new property: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {createProperty}