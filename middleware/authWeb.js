// middleware/authWeb.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    console.warn('❌ Accès refusé : token manquant');
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ex: { userId, email, username }
    next();
  } catch (err) {
    console.error('❌ Token invalide ou expiré :', err.message);
    res.clearCookie('token'); // Supprimer le cookie si le token est invalide
    return res.redirect('/login');
  }
};
