const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/User');

const saltRounds = 10;

router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
  // Extraer body
  const { username, password } = req.body;
  // Comprobar que username y password existen
  if (!password || !username) {
    res.redirect('/auth/signup');
    return;
  }
  // Comprobar que usuario no existe
  try {
    const result = await User.findOne({ username });
    if (result) {
      res.redirect('/auth/signup');
      return;
    }
    // Encriptar el password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // Crear usuario
    const newUser = {
      username,
      password: hashedPassword
    };
    const createdUser = await User.create(newUser);
    // Guardamos usuario en la session
    req.session.currentUser = createdUser;
    // Redirigimos para la homepage
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
