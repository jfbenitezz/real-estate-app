const mongoose = require('mongoose');
const { Decimal128 } = require('bson');

const ACCEPTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'COP'];
const types = ['House', 'Apartment', 'Condominium', 'Villa', 'Other'];
const purposes = ['For Rent', 'For Sale'];

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availability: { type: Boolean, default: true },
  purpose: { type: String, required: true, enum: purposes },
  description: { type: String, required: true },
  type: { type: String, required: true, enum: types},
  price: {
    amount: { type: Decimal128, required: true, min: Decimal128.fromString('0') },
    currency: { type: String, required: true, enum: ACCEPTED_CURRENCIES, default: 'COL' }, // Enum to restrict to accepted currencies
  },
  // Modularize address fields for better queries
  address: {
    street_type_1: { type: String, required: true },
    street_name_1: { type: String, required: true },
    street_type_2: { type: String, required: false },
    street_name_2: { type: String, required: false },
    unit_number: { type: String, required: false },
    neighborhood: { type: String, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal_code: { type: String, required: false },
    country: { type: String, required: true },
    fullAddress: { type: String, required: false }
  },
  
  // Other optional property fields
  size: { type: Number, min: 0 }, 
  bedrooms: { type: Number, min: 0 }, 
  bathrooms: { type: Number, min: 0 },
  constructionYear: { type: Number, min: 0, max: new Date().getFullYear() },
  profilePictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
},{timestamps: true});

propertySchema.pre('save', function(next) {
  const addressParts = [
      `${this.address.street_type_1} ${this.address.street_name_1},`,
      this.address.street_type_2 && this.address.street_name_2 ? `${this.address.street_type_2} ${this.address.street_name_2},` : null,
      this.address.unit_number ? `${this.address.unit_number}` : null,
      `${this.address.neighborhood},`
  ].filter(Boolean);
  this.address.fullAddress = addressParts.join(' ');
  next();
});

propertySchema.index(
  { title: 'text', description: 'text' },
  { name: 'search_index' }
);
const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
