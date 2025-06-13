const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  catway: { type: mongoose.Schema.Types.ObjectId, ref: 'Catway', required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // en jours
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);
