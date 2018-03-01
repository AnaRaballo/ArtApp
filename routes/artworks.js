const express = require('express');
const Artwork = require('../models/artwork');
// const TYPES = require('..models/artwork-types');
const router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: './public/uploads/' });
const { ensureLoggedIn } = require('connect-ensure-login');

//GET all artworks
router.get('/artworks', function(req, res, next) {
    Artwork.find({}, (err, artworksArray) => {
      if (err) { return next(err); }
  
      res.render('artwork/index', {
        title: req.user.username,
        description: req.user.description,
        artwork: artworksArray
      });
    });
  });

//GET new artwork
router.get('/new', (req, res) => {
    res.render('artwork/new');
    // res.send("test");
});

//POST new artwork
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

//Show new artwork
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

//GET artwork to edit
router.get('/artwork/:id/edit', ensureLoggedIn('/login'), (req, res, next) => {
    Artwork.findById(req.params.id, (err, artwork) => {
        if (err) {return next(err)}
        if (!artwork) {return next(new Error("404")) }
        // if (!artwork) {return next()}
        return res.render('artwork/edit', { artwork: artwork })
    });
});

//POST edited artwork
router.post('/artwork/:id', upload.single('photo'), ensureLoggedIn('/login'), (req, res, next) => {
    const updates = {
        title: req.body.title,
        description: req.body.description,
        category:req.body.category
    };
    if(req.file){
        updates.picturePath = `/uploads/${req.file.filename}`;
        updates.originalName = req.file.originalName;
    }

    Artwork.findByIdAndUpdate(req.params.id, updates, (err, artwork) => {
        if (err) { 
            return res.render('artworks/edit', { artwork, errors: artwork.errors });
        } else if (!artwork) { 
            return next(new Error('404'));
        } else {
            return res.redirect(`/artwork/${artwork._id}`);
        }
    })
});

//Delete artwork
router.get('/artwork/:id/delete', function(req, res, next) {
    Artwork.findOne({ _id: req.params.id }, (err, artwork) => {
      if (err) { return next(err); }
  
      artwork.remove((err) => {
        if (err) { return next(err); }
  
        //change when display works
        res.redirect('/');
      });
    });
  });
  




module.exports = router;