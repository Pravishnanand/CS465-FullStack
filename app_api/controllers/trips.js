const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and Json message to the requesting client
const tripsList = async (req, res) => {
  try {
    const q = await Model.find({}).exec();

    if (!q) { // Database returned no data
      return res.status(404).json({ message: 'No trips found' });
    } else { // Return resulting trip list
      return res.status(200).json(q);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and Json message to the requesting client
const tripsFindByCode = async (req, res) => {
  try {
    const q = await Model.find({ 'code': req.params.tripCode }).exec();

    if (!q) { // Database returned no data
      return res.status(404).json({ message: 'Trip not found' });
    } else { // Return resulting trip
      return res.status(200).json(q);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST: /trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => { // Fixed 'rest' to 'res'
  try {
    const newTrip = new Trip({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });

    const q = await newTrip.save();

    if (!q) { // Save operation failed
      return res.status(400).json({ message: 'Unable to save trip' });
    } else { // Return new trip
      return res.status(201).json(q);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT: /trips/:tripCode - Updates a Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => { // Fixed function definition
  try {
    console.log(req.params);
    console.log(req.body);

    const q = await Model
      .findOneAndUpdate(
        { 'code': req.params.tripCode },
        {
          code: req.body.code,
          name: req.body.name,
          length: req.body.length,
          start: req.body.start,
          resort: req.body.resort,
          perPerson: req.body.perPerson,
          image: req.body.image,
          description: req.body.description
        },
        { new: true } // Return the updated document
      )
      .exec();

    if (!q) { // Database returned no data
      return res.status(400).json({ message: 'Unable to update trip' });
    } else { // Return resulting updated trip
      return res.status(201).json(q);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip, // Ensure this is exported
  tripsUpdateTrip // Ensure this is exported
};
