const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// INDEX - list all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.render('users/index.ejs', { users });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// SHOW - view one user's pantry (read-only)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.redirect('/users');

    res.render('users/show.ejs', { user });
  } catch (error) {
    console.log(error);
    res.redirect('/users');
  }
});

module.exports = router;
