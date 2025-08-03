const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const upload = require('../middleware/upload'); // ✅ multer config

// Register Form
router.get('/register', (req, res) => {
  res.render('register');
});

// Register User with Profile Picture
router.post('/register', upload.single('profilePic'), async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);

  const user = new User({
    name,
    email,
    passwordHash,
    profilePic: req.file ? `/uploads/${req.file.filename}` : undefined // ✅ Save image path
  });

  await user.save();
  res.redirect('/login');
});

// Login Form
router.get('/login', (req, res) => {
  res.render('login');
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.body.username });
    console.log("🧠 Found user:", foundUser);

    const validPassword = bcrypt.compareSync(req.body.password, foundUser.passwordHash);
    console.log("🔐 Password valid:", validPassword);

    if (!validPassword) {
      return res.send("Password is incorrect");
    }

    req.session.user = {
      name: foundUser.name,
      _id: foundUser._id.toString(),
      profilePic: foundUser.profilePic // ✅ store for later use
    };

    console.log("✅ Session stored:", req.session.user);
    res.redirect("/device");

  } catch (error) {
    console.log("❌ Error during login:", error);
    res.send("Login failed");
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
