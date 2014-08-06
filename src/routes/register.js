'use strict';

var router = require('express').Router();
var validator = require('validator');

var rekuire = require('rekuire');
var logger = rekuire('logger');
var registrationHelper = rekuire('registrationHelper');

router.get('/', function (req, res) {
	res.render('registration/roleChoice');
});

router.get('/:role(driver|manager|admin)', function (req, res) {
	var role = req.param('role');

	res.render('registration/register', {
		role: role,
		registrationFormAction: '/register/' + role
	});
});

router.post('/:role(manager|driver|admin)', function (req, res) {
	var role = req.param('role');
	var email = req.param('email');
	var password = req.param('password');
	var passwordAgain = req.param('passwordAgain');

	registrationHelper.register(role, email, password, passwordAgain, function(err) {
		if (err) {
			res.render('registration/register', {
				role: role,
				registrationFormAction: '/register/' + role,
				validationErrors: err.errorMessages
			});
		} else {
			res.render('message', {
				messageHeading: 'Registerd successfully!',
				messageText: 'Now you can login with your credentials.',
				messageNotice: '*have a lot of fun'
			});
		}
	});
});

module.exports = router;