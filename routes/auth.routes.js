const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register Form
router.get('/register', (req, res) => {
  res.render('register');
});

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = new User({ name, email, passwordHash });
  await user.save();
  res.redirect('/login');
});

// Login Form
router.get('/login', (req, res) => {
  res.render('login');
});


// Login User
router.post("/login",async(req,res)=>{
    try{
        const foundUser = await User.findOne({email:req.body.username})
        console.log(foundUser)
        const validPassword = bcrypt.compareSync(req.body.password,foundUser.passwordHash)
        console.log(validPassword)

        if(!validPassword){
            return res.send("Password is incorrect")
        }  
        // creates a session for our user once they are logged in
        req.session.user = {
            username: foundUser.username,
            _id: foundUser._id
        }

        res.redirect("/device")

    }
    catch(error){
        console.log(error)
    }
})

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;


