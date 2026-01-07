const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// INDEX - list all pantry items
router.get('/', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  res.render('foods/index.ejs', { user });
});

// NEW - show form to add new food
router.get('/new', (req, res) => {
  res.render('foods/new.ejs');
});

// CREATE - add new food
router.post('/', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  user.pantry.push(req.body);
  await user.save();
  res.redirect(`/users/${user._id}/foods`);
});

// EDIT - show form to edit food
router.get('/:itemId/edit', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const food = user.pantry.id(req.params.itemId);
  res.render('foods/edit.ejs', { food });
});

// UPDATE - save changes to food
router.put('/:itemId', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const food = user.pantry.id(req.params.itemId);
  food.name = req.body.name;
  await user.save();
  res.redirect(`/users/${user._id}/foods`);
});

// DELETE - remove food
router.delete('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.redirect('/');

    const item = user.pantry.id(req.params.itemId);
    if (!item) return res.redirect(`/users/${user._id}/foods`);

    item.remove();
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


module.exports = router;
