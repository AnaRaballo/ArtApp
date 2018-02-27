const express = require('express');
const Artwork = require('../models/artwork');
// const TYPES = require('..models/artwork-types');
const router = express.Router();
const { ensureLoggedIn } = require('connect-ensure-login');

router.get('/new', (req, res) => {
    res.render('artwork/new');
    // res.send("test");
});

router.post('/artworks', ensureLoggedIn('/login'), (req, res, next) => {
    const newArtwork = new Artwork ({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        _creator: req.user._id
    });
    newArtwork.save( (err) => {
        if (err) {
            res.render('artwork/new', { artwork: newArtwork});
        } else {
            res.redirect(`/artwork/${newArtwork._id}`);
        }
    });
});

router.get('/:id', (req, res, next) => {
    Artwork.findById(req.params.id, (err, artwork) => {
      if (err){ 
          return next(err); 
        }
    //   artwork.populate('_creator', (err, artwork) => {
    //     if (err){ return next(err); }
        return res.render('artwork/show', { artwork });
      });
    });
//   });

router.get('/:id/edit', ensureLoggedIn('/login'), (req, res, next) => {
    Artwork.findById(req.params.id, (err, campaign) => {
        if (err) {return next(err)}
        if (!artwork) {return next(new Error("404")) }
        return res.render('artworks/edit', {artwork, types: TYPES})
    });
});

router.post('/:id', ensureLoggedIn('/login'), (req, res, next) => {
    const updates = {
        title: req.body.title,
        description: req.body.description,
        category:req.body.category
    };

    Artwork.findByIdAndUpdate(req.params.id, updates, (err, campaign) => {
        if (err) {
            return res.render('artworks/edit', {
                artwork,
                errors: campaign.errors
         });
        }
        if (!artwork) {
            return next(new Error('404'));
        }
        return res.redirect(`/artworks/${artwork._id}`);
    })
});




module.exports = router;