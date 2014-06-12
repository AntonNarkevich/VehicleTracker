'use strict';

var router = require('express').Router();
var bcrypt = require('bcrypt');
var validator = require('validator');

var rekuire = require('rekuire');
var database = rekuire('database');
var logger = rekuire('logger');
var formValidator = rekuire('formValidator');

router.get('/', function (req, res) {
	res.render('registration/roleChoice');
});

router.get('/:role(driver|manager)', function (req, res) {
	var role = req.param('role');

	res.render('registration/register', {
		role: role,
		registrationFormAction: '/register/' + role
	});
});

router.post('/:role(manager|driver)', function (req, res) {
	var role = req.param('role');
	var email = req.param('email');
	var password = req.param('password');
	var passwordAgain = req.param('passwordAgain');

	//Validation
	var validationResult = formValidator.validate({
		email: email,
		password: password,
		passwordAgain: passwordAgain
	});

	if (!validationResult.isValid) {
		res.render('registration/register', {
			role: role,
			registrationFormAction: '/register/' + role,
			validationErrors: validationResult.errorMsgs
		});

		return;
	}

	//Validation is passed. Registring.
	bcrypt.hash(password, 10, function (err, hash) {
		if (err) {
			logger.error(err);

			throw err;
		}

		logger.trace('Registring ' + role + ' with hash: ', hash);

		database.uspMBSPUserRegister(email, hash, role, function (err, data) {
			//Last data element contains info about uspMBSPUserRegister execution
			var execInfo = data[data.length - 1];

			if (execInfo === undefined && err) {
				logger.error('Unexpected error at uspMBSPUserRegister: ', err);

				throw err;
			}

			if (execInfo.IsSuccess) {
				res.render('registration/success');
			} else {
				res.render('registration/register', {
					role: role,
					registrationFormAction: '/register/' + role,
					errorMessage: execInfo.Message
				});
			}
		});
	});
});

module.exports = router;