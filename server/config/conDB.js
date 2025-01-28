const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
        console.error("Connection to db failed", err);
        process.exit(1)
    }
};

module.exports = connectDB;

