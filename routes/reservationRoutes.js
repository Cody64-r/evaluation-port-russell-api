const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

// ➕ Créer une réservation
router.post('/', auth, async (req, res) => {
  const { catwayId, date, duration } = req.body;

  if (!catwayId || !date || !duration) {
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }

  try {
    const catway = await Catway.findById(catwayId);
    if (!catway || !catway.isAvailable) {
      return res.status(400).json({ message: 'Catway indisponible.' });
    }

    const reservation = new Reservation({
      user: req.user.userId,
      catway: catwayId,
      date,
      duration
    });

    catway.isAvailable = false;
    await catway.save();
    await reservation.save();

    res.status(201).json({ message: 'Réservation effectuée ✅', reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// 👤 Voir ses propres réservations
router.get('/me', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.userId })
      .populate('catway');

    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// ❌ Supprimer une réservation
router.delete('/:id', auth, async (req, res) => {
  const reservationId = req.params.id;

  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }

    if (reservation.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    const catway = await Catway.findById(reservation.catway);
    if (catway) {
      catway.isAvailable = true;
      await catway.save();
    }

    await reservation.deleteOne();

    res.json({ message: 'Réservation annulée ❌' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
