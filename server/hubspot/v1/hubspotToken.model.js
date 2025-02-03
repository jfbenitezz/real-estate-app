const mongoose = require('mongoose');

const hubSpotTokenSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  accessToken: { 
    type: String, 
    required: true 
  },
  refreshToken: { 
    type: String, 
    required: true 
  },
  expiresAt: { 
    type: Date, 
    required: true 
  },
  hubSpotAppId: { 
    type: String, 
    required: true 
  },
  // Optional: store the time when the token was created
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create a model for the schema
const Token = mongoose.model('HubSpotToken', hubSpotTokenSchema);

module.exports = {Token};
