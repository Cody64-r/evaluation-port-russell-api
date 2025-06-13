// ✅ Charger les variables d'environnement
require('dotenv').config();

// ✅ Importations
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('🟢 Connecté à MongoDB'))
.catch((err) => console.error('🔴 Erreur MongoDB :', err.message));

// ✅ Brancher les routes
app.use('/users', userRoutes);
app.use('/catways', catwayRoutes);
app.use('/reservations', reservationRoutes);

// ✅ Route test principale
app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API du Port de Plaisance Russell 🚤");
});

// ✅ Lancer le serveur
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
