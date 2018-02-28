const express = require('express');
const router = express.Router();
const Artwork = require('../models/artwork');

/* GET home page. */
router.get('/', function(req, res, next) {
  Artwork
  .find({})
  // .populate('_creator')
  .exec((err, artworks) => {
  res.render('index', { artworks });
  });
  // res.send("hello");
});

module.exports = router;
