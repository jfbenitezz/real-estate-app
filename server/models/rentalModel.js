const mongoose = require('mongoose');
const User = require('../users/v1/userModel');
const Property = require('../properties/v1/propertyModel');

const rentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  startDate: { type: Date, required: true },
  durationMonths: { type: Number, required: true }, 
  terminationDate: { type: Date }, // If the renter opts out early
  // Other rental fields
}, {timestamps: true});

// Virtual property to Calculate end date
rentalSchema.virtual('endDate').get(function() {
    const endDate = new Date(this.startDate);
    endDate.setMonth(endDate.getMonth() + this.durationMonths); 
    return endDate;
  });

rentalSchema.virtual('status').get(function() {
  if (this.terminationDate) {
    return 'Terminated';
  } else if (new Date() > this.endDate) {
    return 'Expired';
  } else {
    return 'Active';
  }
});

const Rental = mongoose.model('Rental', rentalSchema);
module.exports = Rental;


  