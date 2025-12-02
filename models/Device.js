const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  mqttTopic: { type: String, required: true }, // 
  description: String,
  name: { type: String, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Device', deviceSchema);
