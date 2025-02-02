const Property = require('./property.model');
const {convertCurrency} = require('../../Misc/currency');
const {getExchangeRateCache} = require('../../Misc/rateCache');

const readProperty = async (id, targetCurrency) => {
    try {
        const targetProperty = await Property.findById(id);
        if (!targetProperty) {
            return { status: 404, error: "Property not found" };
        }

        const { amount, currency: baseCurrency } = targetProperty.price;
        targetCurrency = targetCurrency || baseCurrency;

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

        return { status: 200, data: response };

    } catch (error) {
        console.error(`Error reading property: ${error.message}`);
        return { status: 500, error: error.message };
    }
};

module.exports = {readProperty};