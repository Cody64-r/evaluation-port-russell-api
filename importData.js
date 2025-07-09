require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Catway = require('./models/Catway');
// const Reservation = require('./models/Reservation'); // désactivé temporairement

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch((err) => {
  console.error('❌ Erreur MongoDB :', err.message);
  process.exit();
});

const importData = async () => {
  try {
    // 📥 Lire les fichiers JSON
    const catwaysRaw = JSON.parse(fs.readFileSync('./data/catways.json', 'utf-8'));
    // const reservationsRaw = JSON.parse(fs.readFileSync('./data/reservations.json', 'utf-8'));

    console.log('📦 Catways bruts chargés :', catwaysRaw.length);
    console.log('🧾 Exemple :', catwaysRaw[0]);

    // 🔁 Transformation : adapter les champs à ton modèle
    const transformedCatways = catwaysRaw.map((c, index) => ({
      name: `C${c.catwayNumber || index + 1}`,        // ex : C1, C2, ...
      location: `Zone ${c.catwayType || 'inconnue'}`, // ex : Zone short
      isAvailable: c.catwayState !== 'en panne'
    }));

    console.log(`📦 Catways transformés : ${transformedCatways.length}`);

    // 🧹 Nettoyage
    await Catway.deleteMany();
    await Catway.insertMany(transformedCatways);

    console.log('✅ Catways importés avec succès.');

    // 🔕 Partie réservations ignorée pour l’instant
    /*
    console.log('📦 Réservations brutes chargées :', reservationsRaw.length);
    // TODO : Adapter les réservations plus tard
    */

    process.exit();
  } catch (err) {
    console.error('❌ Erreur d\'importation :', err);
    process.exit(1);
  }
};

importData();
