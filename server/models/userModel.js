const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  address: String,
  contactInfo: String,
  profilePictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  ratings: { type: Number, min: 0, max: 10 },
  isAdmin: { type: Boolean, default: false },
  refreshToken: { type: String }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
User.createIndexes()
module.exports = User;
