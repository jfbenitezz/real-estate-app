const mongoose = require('mongoose');
const { VALID_ROLES } = require('./user.constants');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true},
  password: { 
    type: String, 
    required: function () { return !this.googleId; }  // Required only if googleId is not present
  },
  address: String,
  contactInfo: String,
  profilePictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  role: { type: String, enum: VALID_ROLES, default: "client" },
  googleId: { type: String , required: false},
  refreshToken: { type: String }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
User.createIndexes()
module.exports = User;
