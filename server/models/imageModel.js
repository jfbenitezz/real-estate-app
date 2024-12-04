const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    altText: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }, {timestamps: true});


const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
