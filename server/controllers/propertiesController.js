const Property = require('../models/propertyModel');
const Rental = require('../models/rentalModel');
const {convertCurrency} = require('../Misc/currency');
const {getExchangeRateCache} = require('../Misc/rateCache');

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

const readProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const targetProperty = await Property.findById(id);
        if (!targetProperty) {
            return res.status(404).json({ error: "Property not found" });
        }

        const { amount, currency: baseCurrency } = targetProperty.price;
        const targetCurrency = req.query.targetCurrency || baseCurrency;

        // Convert the amount using the convertCurrency function
        const convertedAmount = await convertCurrency(parseFloat(amount), baseCurrency, targetCurrency, getExchangeRateCache());

        // Add converted amount to the response
        const response = {
            ...targetProperty.toObject(), // Convert mongoose document to plain object
            convertedPrice: {
                amount: convertedAmount,
                currency: targetCurrency
            }
        };

        console.log('Property found:', response);
        res.status(200).json(response);

    } catch (error) {
        console.error(`Error reading property: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { readProperty };


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

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    let property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if the authenticated user is the owner of the property
    if (property.owner.toString() !== req.userId) {
      return res.status(403).json({ error: "Access denied. You are not the owner of this property." });
    }

    // Find rentals associated with the property
    const rentals = await Rental.find({ property: id });
    const hasActiveRentals = rentals.some(rental => rental.status === 'Active');
    if (hasActiveRentals) {
      return res.status(400).json({ error: "Cannot delete property with active rentals" });
    }

    // Delete the property
    const deletedProperty = await Property.findByIdAndDelete(id);
    console.log('Property deleted:', deletedProperty);
    res.status(200).json(deletedProperty);

  } catch (error) {
    console.error(`Error deleting property: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProperty, readProperty , updateProperty, deleteProperty
};

