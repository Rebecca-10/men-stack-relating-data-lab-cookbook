// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// --------------------
// Import controllers
// --------------------
const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js'); // pantry CRUD
const usersController = require('./controllers/users.js'); // community page

// --------------------
// Import middleware
// --------------------
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// --------------------
// Connect to MongoDB
// --------------------
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
});

// --------------------
// Middleware
// --------------------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);

// --------------------
// Set view engine
// --------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --------------------
// Routes
// --------------------

// Home page
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Auth routes (sign-in, sign-up, sign-out)
app.use('/auth', authController);

// Protect all routes below with signed-in middleware
app.use(isSignedIn);

// --------------------
// Community routes first
// --------------------
app.use('/users', usersController); // community page, view other users, user show pages

// --------------------
// Pantry CRUD routes
// --------------------
app.use('/users/:userId/foods', foodsController);

// --------------------
// Start server
// --------------------
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
