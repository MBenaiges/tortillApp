const express = require('express');
const router = express.Router();

const Tortilla = require('../models/Tortilla');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const tortillas = await Tortilla.find();
    res.render('tortillas/list', { tortillas });
  } catch (error) {
    next(error);
  }
});

router.get('/new', (req, res, next) => {
  if (!req.session.CurrentUser) {
    return res.redirect('/');
  }
  res.render('tortillas/create-edit');
});

router.post('/', async (req, res, next) => {
  const { _id, name, special, size } = req.body;
  const tortilla = { name, special, size };
  try {
    if (_id) {
      await Tortilla.findByIdAndUpdate(_id, tortilla);
    } else {
      await Tortilla.create(tortilla);
    }
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/tortillas/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const tortilla = await Tortilla.findById(id);
    res.render('tortillas/detail', tortilla);
  } catch (error) {
    next(error);
  }
});

router.get('/tortillas/:id/edit', async (req, res, next) => {
  const { id } = req.params;
  try {
    const tortilla = await Tortilla.findById(id);
    res.render('tortillas/create-edit', tortilla);
  } catch (error) {
    next(error);
  }
});

router.post('/tortillas/:id/delete', async (req, res, next) => {
  const { id } = req.params;
  try {
    await Tortilla.findByIdAndDelete(id);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
