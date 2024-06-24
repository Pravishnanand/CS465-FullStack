const mongoose = require('mongoose');
const Trip = mongoose.model('Trip'); // Ensure the Trip model is imported
const User = mongoose.model('User'); // Ensure the User model is imported

// Function to get user from JWT payload
const getUser = (req, res, callback) => {
  if (req.payload && req.payload._id) {
    User.findById(req.payload._id)
      .exec((err, user) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        callback(req, res, user);
      });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({});
    if (!trips.length) {
      return res.status(404).json({ message: 'No trips found' });
    }
    return res.status(200).json(trips);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET: /trips/:tripCode - lists a single trip
const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Trip.findOne({ 'code': req.params.tripCode });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    return res.status(200).json(trip);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST: /trips - Adds a new Trip
const tripsAddTrip = (req, res) => {
  getUser(req, res, (req, res, user) => {
    const newTrip = new Trip({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description,
      user: user._id // Associate trip with the user
    });

    newTrip.save()
      .then(trip => res.status(201).json(trip))
      .catch(err => res.status(400).json({ error: 'Failed to create trip', details: err }));
  });
};

// PUT: /trips/:tripCode - Updates a Trip
const tripsUpdateTrip = (req, res) => {
  getUser(req, res, (req, res, user) => {
    Trip.findOneAndUpdate(
      { code: req.params.tripCode, user: user._id }, // Ensure user matches
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
    .then(trip => {
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found or not owned by user' });
      }
      return res.status(200).json(trip);
    })
    .catch(err => res.status(500).json({ error: 'Failed to update trip', details: err }));
  });
};

// DELETE: /trips/:tripCode - Deletes a Trip
const tripsDeleteTrip = (req, res) => {
  getUser(req, res, (req, res, user) => {
    Trip.findOneAndDelete({ code: req.params.tripCode, user: user._id })
      .then(trip => {
        if (!trip) {
          return res.status(404).json({ message: 'Trip not found or not owned by user' });
        }
        return res.status(204).json(); // No content status
      })
      .catch(err => res.status(500).json({ error: 'Failed to delete trip', details: err }));
  });
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};