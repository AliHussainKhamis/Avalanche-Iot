const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  mqttTopic: { type: String, required: true }, // ✅ now stores MQTT topic
  description: String,
  name: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Device', deviceSchema);
