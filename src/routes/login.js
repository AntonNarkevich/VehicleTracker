'use strict';

var passport = require('passport');
var router = require('express').Router();

var rekuire = require('rekuire');
var logger = rekuire('logger');
var formValidator = rekuire('formValidator');

router.get('/', function (req, res) {
	var params = { loginFormAction: '/login', message: req.flash('error') };

	res.render('login', params);
});

router.post('/',
	function(req, res, next) {
		var email = req.param('email');
		var password = req.param('password');

		var validationResult = formValidator.validate({
			email: email,
			password: password
		});

		if (!validationResult.isValid) {
			var params = { loginFormAction: '/login', validationErrors: validationResult.errorMsgs };
			res.render('login', params);

			return;
		}

		next();
	},
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