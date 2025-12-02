// mqttClient.js
const mqtt = require('mqtt');

// Connect to public HiveMQ broker
const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
  console.log("Connected to HiveMQ MQTT Broker");
});

client.on('error', (err) => {
  console.error("MQTT Connection Error:", err);
});

module.exports = client;
