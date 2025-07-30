const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true }, 
  name: { type: String },
  location: { type: String },
  mqttTopic: { type: String }, // can be changed
  mode: { type: String, default: 'auto' },  
  status: { type: String, default: 'on' },  
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // relationship
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema);