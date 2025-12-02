const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const User = require('../models/User');
const isAuthenticated = require('../middleware/auth');
const mqttClient = require('../mqttClient');

// INDEX — Show only the devices owned by the logged-in user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const allDevices = await Device.find({ creator: userId }).populate('creator');
    res.render("devices/index.ejs", {
      allDevices,
      user: req.session.user
    });
  } catch (error) {
    console.error("Error loading devices:", error);
    res.status(500).send("Error loading devices");
  }
});

// NEW — Form to create device
router.get("/new", isAuthenticated, (req, res) => {
  res.render("devices/new", { user: req.session.user });
});

// CREATE — Save device with mqttTopic and creator
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { mqttTopic, name, location, description } = req.body;

    const device = new Device({
      mqttTopic,
      name,
      location,
      description,
      creator: req.session.user._id
    });

    await device.save();
    res.redirect("/device");
  } catch (error) {
    console.error("Failed to create device:", error.message);
    res.status(500).send("Failed to create device");
  }
});

// SHOW — View one device (owner only)
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const foundDevice = await Device.findById(req.params.id);
    if (!foundDevice) return res.status(404).send("Device not found");

    if (foundDevice.creator.toString() !== req.session.user._id) {
      return res.status(403).send("Access denied — not your device");
    }

    res.render("devices/devices-details", { foundDevice });
  } catch (error) {
    res.status(500).send("Error fetching device");
  }
});

// EDIT — Only owner
router.get("/:id/edit", isAuthenticated, async (req, res) => {
  try {
    const foundDevice = await Device.findById(req.params.id);
    if (!foundDevice) return res.status(404).send("Device not found");

    if (foundDevice.creator.toString() !== req.session.user._id) {
      return res.status(403).send("Access denied — not your device");
    }

    res.render("devices/edit", { foundDevice });
  } catch (error) {
    res.status(500).send("Error loading edit form");
  }
});

// UPDATE — Only owner
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const foundDevice = await Device.findById(req.params.id);
    if (!foundDevice) return res.status(404).send("Device not found");

    if (foundDevice.creator.toString() !== req.session.user._id) {
      return res.status(403).send("Access denied — not your device");
    }

    await Device.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/device");
  } catch (error) {
    console.error(" Update failed:", error.message);
    res.status(500).send("Update failed");
  }
});

// DELETE — Only owner
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const foundDevice = await Device.findById(req.params.id);
    if (!foundDevice) return res.status(404).send("Device not found");

    if (foundDevice.creator.toString() !== req.session.user._id) {
      return res.status(403).send("Access denied — not your device");
    }

    await Device.findByIdAndDelete(req.params.id);
    res.redirect("/device");
  } catch (error) {
    console.error(" Delete failed:", error.message);
    res.status(500).send("Delete failed");
  }
});

// CONTROL PAGE — Render control UI (owner only)
router.get("/:id/control", isAuthenticated, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device || device.creator.toString() !== req.session.user._id) {
      return res.status(403).send("Not allowed");
    }

    res.render("devices/control", { device });
  } catch (error) {
    res.status(500).send("Failed to load control page");
  }
});

// CONTROL ACTION — Send MQTT command (owner only)
router.post("/:id/control", isAuthenticated, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device || device.creator.toString() !== req.session.user._id) {
      return res.status(403).send("Not allowed");
    }

    const command = req.body.command;
    mqttClient.publish(device.mqttTopic, command);
    res.redirect(`/device/${device._id}/control`);
  } catch (error) {
    console.error(" MQTT Error:", error);
    res.status(500).send("Failed to send command");
  }
});

module.exports = router;
