const express = require('express');
const router = express.Router();
const Catway = require('../models/Catway');
const auth = require('../middleware/auth');

// ➕ Ajouter un nouveau catway (protégé)
router.post('/', auth, async (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }

  try {
    const existing = await Catway.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Catway déjà existant.' });
    }

    const catway = new Catway({ name, location });
    await catway.save();

    res.status(201).json({ message: 'Catway ajouté ✅', catway });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// 📋 Lister les catways disponibles
router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find({ isAvailable: true });
    res.json(catways);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// ✅ Route test toujours disponible
router.get('/test', (req, res) => {
  res.send('✅ /catways/test fonctionne');
});

module.exports = router;
