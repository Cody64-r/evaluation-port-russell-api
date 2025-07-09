const authWeb = require('./middleware/authWeb');
const Reservation = require('./models/Reservation');

app.get('/reservations', authWeb, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.userId })
      .populate('catway');
    
    res.render('reservations', { user: req.user, reservations });
  } catch (err) {
    console.error('❌ Erreur affichage réservations', err);
    res.status(500).send('Erreur serveur.');
  }
});