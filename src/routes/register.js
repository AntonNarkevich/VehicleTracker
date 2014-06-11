'use strict';

var router = require('express').Router();
var bcrypt = require('bcrypt');
var validator = require('validator');

var rekuire = require('rekuire');
var repository = rekuire('repository');

var database = rekuire('database');
var logger = rekuire('logger');
var formValidator = rekuire('formValidator');

router.get('/', function(req,res) {
	res.render('register');
});

/**
 * No 'get' route. Should be registered during initializtion. /admin/init.
 */
router.post('/admin', function (req, res) {
	res.end('register admin');

	var email = 'your@new.admin';
	var passwordHash = 'whatislove';
	var role = 'admin';

	repository.registerUser(email, passwordHash, role, function(isSuccess, errMessage) {
		res.write('isSuccess ' + isSuccess);
		res.end('errMessage ' + errMessage);
	});
});

/**
 * Manager registration.
 */
router.get('/manager', function (req, res) {
	res.render('register/manager', { registrationFormAction: '/register/manager' });
});

router.post('/manager', function (req, res) {
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
		res.render('register/manager', { registrationFormAction: '/register/manager', validationErrors: validationResult.errorMsgs });

		return;
	}

	//Validation is passed. Registring.
	bcrypt.hash(password, 10, function (err, hash) {
		if (err) {
			logger.error(err);

			throw err;
		}

		logger.trace('Registered user with hash: ', hash);

		database.uspMBSPUserRegister(email, hash, 'manager', function (err, data) {
			//Last data element contains info about uspMBSPUserRegister execution
			var execInfo = data[data.length - 1];

			if (execInfo === undefined && err) {
				logger.error('Unexpected error at uspMBSPUserRegister: ', err);

				throw err;
			}

			if (execInfo.IsSuccess) {
				res.render('register/success');
			} else {
				res.render('register/manager', { registrationFormAction: '/register/manager', errorMessage: execInfo.Message });
			}
		});
	});
});

/**
 * Driver registration.
 */
router.get('/driver', function (req, res) {
	res.render('register/driver', { registrationFormAction: '/register/driver' });
});

router.post('/driver', function (req, res) {
	var email = req.param('email');
	var password = req.param('password');

	repository.registerUser(email, password, 'driver', function(isSuccess, errMessage) {
		if (isSuccess) {
			res.render('register/success');
		} else {
			res.render('register/driver', { registrationFormAction: '/register/driver', message: errMessage });
		}
	});
});

module.exports = router;