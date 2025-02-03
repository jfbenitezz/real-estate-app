const mongoose = require('mongoose');
const clientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    appointmentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
  });
  
  const sellerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    ratings: { type: Number, min: 0, max: 10 },
    commissionRate: { type: Number, min: 0, max: 100 }
  });


  const Client = mongoose.model('Client', clientSchema);
  const Seller = mongoose.model('Seller', sellerSchema);
  module.exports = { Client, Seller };