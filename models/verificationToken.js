const mongoose = require('mongoose');

const verificationTokenSchema  = new mongoose.Schema({
   email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt:{
    type:Date,
    expires:900,
    default: Date.now()
  }
});

module.exports = mongoose.model('verificationToken', verificationTokenSchema);  // ✅ fixed exports
