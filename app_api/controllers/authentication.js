// Load dependencies
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

// Register function
const register = async (req, res) => {
  // Check for missing fields
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ "message": "All fields required" });
  }
  
  // Create a new user
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  // Save the user to the database
  try {
    await user.save();
    const token = user.generateJwt();
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(400).json(err);
  }
};

// Login function
const login = (req, res) => {
  // Check for missing fields
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ "message": "All fields required" });
  }
  
  // Use passport's local strategy for authentication
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(404).json(err);
    }
    
    if (user) {
      const token = user.generateJwt();
      return res.status(200).json({ token });
    } else {
      return res.status(401).json(info);
    }
  })(req, res);
};

// Export the functions
module.exports = {
  register,
  login
};