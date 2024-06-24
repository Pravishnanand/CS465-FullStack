const express = require('express'); // Express app
const router = express.Router();    // Router logic
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

const authController = require('../controllers/authentication');
// This is where we import the controllers we will route 
const tripsController = require('../controllers/trips');

router
    .post('/login', authController.login)
    .post('/register', authController.register);
    
// define route for one trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList) // GET Method routes tripList
    .post(auth, tripsController.tripsAddTrip);

// GET Method routes tripsFindByCode - requires parameter
// PUT Method routes trupsUpdateTrip - requires parameter
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(auth, tripsController.tripsUpdateTrip);

module.exports = router;

