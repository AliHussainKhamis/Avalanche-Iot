const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const isAuthenticated = require('../middleware/auth'); // needs to be authenticated


router.get("/",async(req,res)=>{
    const allDevices = await Device.find()
    res.render("devices/index.ejs",{allDevices:allDevices})
})

router.get("/new",async(req,res)=>{
    res.render("devices/new")
})


module.exports = router;