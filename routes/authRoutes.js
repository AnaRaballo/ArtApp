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

router.get('/:id/edit', ensureLoggedIn('/login'), (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {return next(err)}
        if (!user) {return next(new Error("404")) }
        return res.render('user/edit', {user: user})
    });
});



module.exports = router;
