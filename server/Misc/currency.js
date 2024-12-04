const axios = require('axios');
const fs = require('node:fs/promises');
const path = require('node:path');
const { setExchangeRateCache } = require('./rateCache');

const ACCEPTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'COP'];

// Function to fetch exchange rate for a specific currency
async function getExchangeRate(baseCurrency, targetCurrency) {
    try {
      if (!isValidCurrency(baseCurrency) || !isValidCurrency(targetCurrency)) {
        throw new Error('Invalid currency code');
      }

      if (baseCurrency === targetCurrency) {
        return 1
      }
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/pair/${baseCurrency}/${targetCurrency}`);
      const { conversion_rate } = response.data;

      return conversion_rate;
    } catch (error) {
        console.error('Error fetching exchange rate:', error.message);
        // If exchange rate fetching fails, return 1 to indicate no conversion
        return 1;
    }
  }

function isValidCurrency(currencyCode) {
    // Check if the currency code is a non-empty string and in the list of accepted currencies
    return typeof currencyCode === 'string' && currencyCode.trim() !== '' &&
        ACCEPTED_CURRENCIES.includes(currencyCode.trim().toUpperCase());
}

async function prefetchExchangeRates(Map) {
  try {
      const exchangeRates = {};
      for (let baseCurrency of ACCEPTED_CURRENCIES) {
          exchangeRates[baseCurrency] = {};
          for (let targetCurrency of ACCEPTED_CURRENCIES) {
              if (baseCurrency !== targetCurrency) {
                  const exchangeRate = await getExchangeRate(baseCurrency, targetCurrency);
                  exchangeRates[baseCurrency][targetCurrency] = {
                      rate: exchangeRate,
                      timestamp: Date.now()
                  };
                  // Cache the exchange rate
                  Map.set(`${baseCurrency}_${targetCurrency}`, exchangeRate);
              }
          }
      }
      setExchangeRateCache(Map);
      console.log('All exchange rates prefetched and cached successfully.');
  } catch (error) {
      console.error('Error prefetching and caching exchange rates:', error.message);
  }
}

// Reusable function to convert currency
async function convertCurrency(amount, baseCurrency, targetCurrency, Cache) {
  try {
      const startTime = performance.now()
      if (baseCurrency === targetCurrency) {
          return amount; // No conversion needed
      }

      const cacheKey = `${baseCurrency}_${targetCurrency}`;
      if (!Cache.has(cacheKey)) {
          throw new Error('Exchange rate not found in cache');
      }

      const exchangeRate = Cache.get(cacheKey);
      const endTime = performance.now();
      console.log(`Exchange rate fetched from cache. Time taken: ${endTime - startTime} ms`);
      return amount * exchangeRate;
  } catch (error) {
      console.error('Error converting currency:', error.message);
      return amount; // Return original amount if conversion fails
  }
}

module.exports = { getExchangeRate, convertCurrency, prefetchExchangeRates };