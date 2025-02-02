const winston = require('winston');
require('winston-daily-rotate-file');

// Configure the logger with rotation
const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log', // Log file format with date
  datePattern: 'YYYY-MM-DD', // Date format in filename
  maxSize: '20m', // Maximum size of each log file
  maxFiles: '14d', // Keep logs for the past 14 days
  level: 'http', // Minimum log level
  mkdir: true,
});
// Create the logger
const logger = winston.createLogger({
    level: 'http',
    format: winston.format.combine(
      winston.format.timestamp(), // Add a timestamp
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`; // Custom log format
      })
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      transport, // Daily rotate file transport
    ],
  });
  
  // Logging middleware function
  const logMiddleware = (req, res, next) => {
    const logMessage = `${req.method} ${req.url} - ${req.ip} - Status: ${res.statusCode}`; // Include status code
    logger.http(logMessage); // Log the request details
    next(); // Continue to the next middleware or route handler
  };

// Export the logger and middleware
module.exports = { logger, logMiddleware };