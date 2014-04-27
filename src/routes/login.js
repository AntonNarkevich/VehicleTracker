'use strict';

var passport = require('passport');
var router = require('express').Router();

router.get('/', function (req, res) {
	res.render('login', { loginFormAction: '/login' });
});

router.post('/',
	passport.authenticate('local', {
			failureRedirect: '/login'
		}),
		function (req, res) {
			res.redirect(req.session.returnTo || '/');
			delete req.session.returnTo;
		}
);

module.exports = router;