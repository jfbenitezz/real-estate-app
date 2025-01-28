const Property = require('./propertyModel');
const {convertCurrency} = require('../../Misc/currency');
const {getExchangeRateCache} = require('../../Misc/rateCache');

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

module.exports = {readProperty};