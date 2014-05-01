'use strict';

var passport = require('passport');
var router = require('express').Router();

var  rekuire = require('rekuire');
var logger = rekuire('logger');

router.get('/', function (req, res) {
	var params = { loginFormAction: '/login', message: req.flash('error') };

	res.render('login', params);
});

router.post('/',
	passport.authenticate('local', {
		failureRedirect: '/login',
		failureFlash: true
	}),
	function (req, res) {
		res.redirect(req.session.returnTo || '/');
		delete req.session.returnTo;
	}
);

module.exports = router;