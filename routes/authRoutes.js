const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

const{ ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');

router.get('/login', ensureLoggedOut(), (req, res) => {
    res.render('authentication/login');
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/signup', ensureLoggedOut(), (req, res) => {
    res.render('authentication/signup');
});

router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup'
}));

router.post('/logout', ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get("/user/:id/edit-user", ensureLoggedIn("/login"), (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {return next(err)}
        if (!user) {return next(new Error("404")) }
        return res.render('authentication/edit-user', {user : user})
    });
});

router.post('/user/:id', ensureLoggedIn('/login'), (req, res, next) => {
    const updateUser = {
        username: req.body.username,
        email: req.body.email,
        description: req.body.description,
        password: req.body.password
    };

    User.findByIdAndUpdate(req.params.id, updateUser, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('authentication/edit-user', {user, errors: user.errors});
        } else if (!user) {
            console.log(err);
            return next(new Error('404'));
        } 
        else {
            return res.redirect('/artworks');
        }
    })
});

//Delete user
router.get('/user/:id/delete', function(req, res, next) {
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err) { return next(err); }
  
      user.remove((err) => {
        if (err) { return next(err); }
  
        //change when display works
        res.redirect('/');
      });
    });
  });
  


module.exports = router;
