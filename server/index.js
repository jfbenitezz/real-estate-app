const dotenv = require("dotenv")
dotenv.config()

const express = require('express')
const app = express()
app.use(express.json())

const helmet = require('helmet');
app.use(helmet());

const apicache = require('apicache');
const cache = apicache.middleware;

// Custom cache condition to only cache GET requests and exclude the /catalog route
const onlyGetRequests = (req, res) => {
  return req.method === 'GET'
};
app.use(cache('5 minutes', onlyGetRequests));

//This I m not sure, preventing cost I guess
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 150, // 100 requests per 5 minutes
});

app.use(limiter);
app.disable('x-powered-by')

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests only from this origin
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
  origin : true
};
app.use(cors(corsOptions));

const usersRoute = require("./routes/users")
const propertiesRoute = require("./routes/properties")
const rentalsRoute = require("./routes/rentals")
const purchaseRoute = require("./routes/purchase")
const catalogRoute = require("./routes/catalog")
const filterRoute = require("./routes/filter")
const imageRoute = require("./routes/images")
const authRoute = require("./routes/auth")


app.use("/properties", propertiesRoute)
app.use("/users", usersRoute)
app.use("/rentals", rentalsRoute)
app.use("/catalog", catalogRoute)
app.use("/filter", filterRoute)
app.use("/images", imageRoute)
app.use("/auth", authRoute)
app.use("/purchase", purchaseRoute)

env = process.env.NODE_ENV || 'development';
app.use((err, req, res, next) => {
  if (env === 'production') {
    res.status(500).send('Server Error');
  } else {
    // In development, you may want to send the full error message for debugging purposes
    res.status(500).send(err.message);
  }
});

// Schedule updating rates to run once every day at 12:00 AM (midnight)
const exchange = new Map();
const { getExchangeRateCache, setExchangeRateCache } = require('./Misc/rateCache');
const { prefetchExchangeRates } = require('./Misc/currency');
const cron = require('node-cron');

// Initalize cacheRates once at startup
console.log("Setting new cache...");
prefetchExchangeRates(exchange) //Ponlo de vuelta

cron.schedule('0 0 * * *', async () => {
  console.log('Fetching and storing exchange rates...');
  await prefetchExchangeRates(exchange);
}, {
  timezone: 'America/Bogota' 
});

module.exports = { app };