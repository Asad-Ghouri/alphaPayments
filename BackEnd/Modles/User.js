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
      createdat:{
        type:String
      },
      status:{
        type:String,
        default:"Pending"
      }
    },
  ],
},{
  timestamps: true, // Add createdAt and updatedAt for the main User model
});

const User = mongoose.model("User", userSchema);

module.exports = User;
