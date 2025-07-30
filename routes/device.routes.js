const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const isAuthenticated = require('../middleware/auth'); // needs to be authenticated

// Index
router.get("/",async(req,res)=>{
    const allDevices = await Device.find() //This is the one that has all the logged devices
    res.render("devices/index.ejs",{allDevices:allDevices})
})

// New
router.get("/new",async(req,res)=>{
    res.render("devices/new")
})

// Create
router.post("/",async(req,res)=>{
    try{
    await Device.create(req.body)
    res.redirect("/device")
    }
    catch(error){
        console.log(error)
    }
})

// Show
// router.get("/:id",async(req,res)=>{
//     await Device.findById(req.params.id)
//     res.render("/device/")
// })


module.exports = router;