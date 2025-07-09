require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch((err) => {
  console.error('❌ Erreur MongoDB :', err.message);
  process.exit();
});

const importReservations = async () => {
  try {
    const data = JSON.parse(fs.readFileSync('./data/reservations.json', 'utf-8'));
    console.log(`📦 Réservations brutes chargées : ${data.length}`);
    console.log('🧾 Exemple :', data[0]);

    const users = await User.find();
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Import annulé.');
      process.exit(1);
    }

    const defaultUser = users[0];
    const catways = await Catway.find();

    const transformed = [];

    for (let r of data) {
      const matchedCatway = catways.find(c => c.name === `C${r.catwayNumber}`);
      if (!matchedCatway) continue;

      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // en jours

      if (isNaN(duration) || duration <= 0) continue;

      transformed.push({
        user: defaultUser._id,
        catway: matchedCatway._id,
        date: start,
        duration
      });

      // Marque le catway comme occupé
      matchedCatway.isAvailable = false;
      await matchedCatway.save();
    }

    await Reservation.deleteMany();
    await Reservation.insertMany(transformed);

    console.log(`✅ ${transformed.length} réservations importées avec succès.`);
    process.exit();
  } catch (err) {
    console.error('❌ Erreur d\'importation :', err);
    process.exit(1);
  }
};

importReservations();
