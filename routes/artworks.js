const express = require('express');
const Artwork = require('../models/artwork');
// const TYPES = require('..models/artwork-types');
const router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: './public/uploads/' });
const { ensureLoggedIn } = require('connect-ensure-login');

router.get('/new', (req, res) => {
    res.render('artwork/new');
    // res.send("test");
});

router.post('/artworks', upload.single('photo'),ensureLoggedIn('/login'), (req, res, next) => {
    const newArtwork = new Artwork ({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        _creator: req.user._id,
        picturePath: `/uploads/${req.file.filename}`,
        originalName: req.file.originalName
    });
    newArtwork.save( (err) => {
        if (err) {
            res.render('artwork/new', { artwork: newArtwork});
        } else {
            res.redirect(`/artwork/${newArtwork._id}`);
        }
    });
});

router.get('/artwork/:id', (req, res, next) => {
    Artwork.findById(req.params.id, (err, artwork) => {
      if (err){ 
          return next(err); 
        }
      artwork.populate('_creator', (err, artwork) => {
        if (err){ return next(err); }
        return res.render('artwork/show', { artwork });
      });
    });
});

router.get('/artwork/:id/edit', ensureLoggedIn('/login'), (req, res, next) => {
    Artwork.findById(req.params.id, (err, artwork) => {
        if (err) {return next(err)}
        if (!artwork) {return next(new Error("404")) }
        return res.render('artwork/edit', { artwork: artwork })
    });
});

router.post('/artwork/:id', upload.single('photo'), ensureLoggedIn('/login'), (req, res, next) => {
    const updates = {
        title: req.body.title,
        description: req.body.description,
        category:req.body.category ,
        picturePath: `/uploads/${req.file.filename}`,
        originalName: req.file.originalName
    };

    Artwork.findByIdAndUpdate(req.params.id, updates, (err, artwork) => {
        if (err) { 
            return res.render('artworks/edit', { artwork, errors: artwork.errors });
        } else if (!artwork) { 
            return next(new Error('404'));
        } else {
            return res.redirect(`/artwork/${artwork._id}`);
            // res.send("meow");
        }
    })
});

router.post('/artwork/:id/delete', function(req, res, next) {
    Artwork.findOne({ _id: req.params.id }, (err, artwork) => {
      if (err) { return next(err); }
  
      newArtwork.remove((err) => {
        if (err) { return next(err); }
  
        res.redirect('/');
      });
    });
  });
  




module.exports = router;