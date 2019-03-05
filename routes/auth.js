const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/User');

const { requireAnon, requireUser, requireFields } = require('../middlewares/auth.js');
// para encriptar password
const saltRounds = 10;

router.get('/signup', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
  // Extraer body
  const { username, password } = req.body;

  // Comprobar que usuario no existe
  try {
    const result = await User.findOne({ username });
    if (result) {
      req.flash('validation', 'This username is taken');
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

router.get('/login', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
  // Extraer info del body
  const { username, password } = req.body;
  try {
    // comprobar que el usuario existe
    const user = await User.findOne({ username });

    if (!user) {
      req.flash('validation', 'Username or password incorrect');
      res.redirect('auth/login');
      return;
    }
    // comparar contraseña
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      // redirigir
      res.redirect('/');
    } else {
      req.flash('validation', 'Username or password incorrect');
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireUser, async (req, res, next) => {
  delete req.session.currentUser;

  res.redirect('/');
});

module.exports = router;
