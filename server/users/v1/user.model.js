const mongoose = require('mongoose');
const { VALID_ROLES } = require('./user.constants');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  address: String,
  contactInfo: String,
  profilePictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  ratings: { type: Number, min: 0, max: 10 },
  role: { type: String, enum: VALID_ROLES, default: "client" },
  refreshToken: { type: String }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
User.createIndexes()
module.exports = User;
