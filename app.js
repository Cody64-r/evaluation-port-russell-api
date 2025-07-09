require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Middlewares & routes
const authWeb = require('./middleware/authWeb');
const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

// Config moteur EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('🟢 Connecté à MongoDB'))
  .catch((err) => console.error('🔴 Erreur MongoDB :', err.message));

// Routes API
app.use('/users', userRoutes);
app.use('/catways', catwayRoutes);
app.use('/reservations', reservationRoutes);

// Routes EJS
app.get('/', (req, res) => {
  const user = req.user || null;
  res.render('index', { user });
});

app.get('/login', (req, res) => {
  res.render('login', { user: null, error: null });
});

app.get('/register', (req, res) => {
  res.render('register', { user: null, error: null });
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

app.get('/reservations', authWeb, async (req, res) => {
  const Reservation = require('./models/Reservation');
  const reservations = await Reservation.find({ user: req.user.userId }).populate('catway');
  res.render('reservations', { user: req.user, reservations });
});

app.get('/reservations/new', authWeb, async (req, res) => {
  const Catway = require('./models/Catway');
  const catways = await Catway.find({ isAvailable: true });
  res.render('newReservation', { user: req.user, catways });
});

// Lancement du serveur
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
