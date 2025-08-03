const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profilePic: { type: String }, // <-- New field
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('User', userSchema);
