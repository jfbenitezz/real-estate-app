const exchangeRateCache = new Map();

function getExchangeRateCache() {
    return exchangeRateCache;
}

function setExchangeRateCache(newCache) {
    if (newCache instanceof Map) {
        exchangeRateCache.clear();
        newCache.forEach((value, key) => {
            exchangeRateCache.set(key, value);
        });
    } else {
        throw new Error('Invalid cache format. Must be a Map.');
    }
}

module.exports = { getExchangeRateCache, setExchangeRateCache }