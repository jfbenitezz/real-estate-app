const Property = require('./property.model');
const createProperty = async (propertyData, userId) => {
  try {
    const newProperty = new Property({
      ...propertyData,
      owner: userId
    });

    await newProperty.save();

    return { status: 201, data: newProperty };
  } catch (error) {
    console.error(`Error saving new property: ${error.message}`);
    return { status: 500, error: error.message };
  }
};

module.exports = { createProperty };