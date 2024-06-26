const express = require('express'); // Express app
const router = express.Router();    // Router logic
const { expressjwt: jwt } = require('express-jwt');

const auth = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
});

const authController = require('../controllers/authentication');
// This is where we import the controllers we will route 
const tripsController = require('../controllers/trips');

router
    .route('/login')
    .post((req, res, next) => {
        console.log('Login route hit');
        next();
    }, authController.login);

router
    .route('/register')
    .post((req, res, next) => {
        console.log('Register route hit');
        next();
    }, authController.register);
    
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
    .put(auth, tripsController.tripsUpdateTrip)
    .delete(auth, tripsController.tripsDeleteTrip);

module.exports = router;