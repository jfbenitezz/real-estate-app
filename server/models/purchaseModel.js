const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  purchasePrice: { type: Number, required: true },
  paymentTerms: { type: String }, // Details about payment terms
  financingDetails: { // Financing information
    lender: String,
    loanAmount: Number,
    interestRate: Number,
    loanTerm: Number, // In years
  },
  closingDate: { type: Date, required: true },
  legalDocumentation: String, // Information about legal documents
  propertyInspection: { // Property inspection details
    date: Date,
    results: String,
    repairAgreements: String,
  },
  closingCosts: String, // Details about closing costs
}, { timestamps: true });

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
