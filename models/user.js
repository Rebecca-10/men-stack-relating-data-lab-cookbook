const mongoose = require('mongoose');

// Schema for each food item in a user's pantry
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// Schema for the user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  pantry: [foodSchema] // embed array of food items
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
