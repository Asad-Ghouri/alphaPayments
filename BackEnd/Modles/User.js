const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Make the email field unique
  },
  password: {
    type: String,
    required: true,
  },
  apiKeys: [
    {
      apiKey: {
        type: String,
      },
    },
  ],
  paymentLinks: [
    {
      qrCode:{
        type: String,
      },
      note: {
        type: String,
      },
      currency: {
        type: String,
      },
      amount: {
        type: String,
      },
      privateKey:{
        type: String,
      }, 
      uniqueid:{
        type: String,
      },
      address:{
        type: String,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
