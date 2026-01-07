// controllers/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

// SIGN UP - render form
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

// SIGN IN - render form
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

// SIGN OUT - destroy session
router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// SIGN UP - handle form submission
router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) return res.send('Username already taken.');

    if (req.body.password !== req.body.confirmPassword)
      return res.send('Password and Confirm Password must match');

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    const newUser = await User.create(req.body);

    // Automatically log the user in after signup
    req.session.user = {
      username: newUser.username,
      _id: newUser._id
    };

    // Redirect directly to their pantry
    res.redirect(`/users/${newUser._id}/foods`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// SIGN IN - handle form submission
router.post('/sign-in', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) return res.send('Login failed. Please try again.');

    const validPassword = await bcrypt.compare(req.body.password, userInDatabase.password);
    if (!validPassword) return res.send('Login failed. Please try again.');

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };

    // Redirect directly to their pantry
    res.redirect(`/users/${userInDatabase._id}/foods`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
