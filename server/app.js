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

const {logMiddleware} = require('./middleware/log.middleware');
app.use(logMiddleware);

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests only from this origin
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
  origin : true
};
app.use(cors(corsOptions));

const passport = require('./config/authStrategy');
app.use(passport.initialize());

const usersRoute = require("./users/v1/user.routes")
const authRoute = require("./auth/v1/auth.routes")
const propertiesRoute = require("./properties/v1/properties.routes")
const catalogRoute = require("./properties/v1/catalog.routes")
const rentalsRoute = require("./rentals/v1/rental.routes")
const purchaseRoute = require("./purchases/v1/purchase.routes")
const imageRoute = require("./images/v1/images.routes")
const healthRoute = require("./Misc/healthCheck")
const hubspotRoute = require("./hubspot/v1/hubspotAuth.routes")
const hubspotAPIRoute = require("./hubspot/v1/hubspotAPI.routes")

const SERVER_VERSION = "";
app.use(SERVER_VERSION + "/properties", propertiesRoute)
app.use(SERVER_VERSION + "/users", usersRoute)
app.use(SERVER_VERSION + "/rentals", rentalsRoute)
app.use(SERVER_VERSION + "/catalog", catalogRoute)
app.use(SERVER_VERSION + "/images", imageRoute)
app.use(SERVER_VERSION + "/auth", authRoute)
app.use(SERVER_VERSION + "/purchase", purchaseRoute)
app.use(SERVER_VERSION + "/health", healthRoute)
app.use(SERVER_VERSION + "/hubspot", hubspotRoute, hubspotAPIRoute)

function routeNotFound(req, res) {
  res.status(404).json({
    error: "Route not found"  
  });
}
app.use(routeNotFound);

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
//prefetchExchangeRates(exchange)                       //**************************Ponlo de vuelta*************

cron.schedule('0 0 * * *', async () => {
  console.log('Fetching and storing exchange rates...');
  //await prefetchExchangeRates(exchange);
}, {
  timezone: 'America/Bogota' 
});

module.exports = { app };