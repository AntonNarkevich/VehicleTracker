'use strict';

var router = require('express').Router();
var bcrypt = require('bcrypt');

var rekuire = require('rekuire');
var repository = rekuire('repository');

var database = rekuire('database');
var logger = rekuire('logger');

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

	//Validation goes here.

	bcrypt.hash(password, 10, function (err, hash) {
		if (err) {
			logger.log(err);
			throw err;
		}

		database.

		//TODO: I need BINARY(40) to store it
		console.log(hash);
	});




	//TODO: Use crypto and salt here.
	//TODO: add validation here.
	//var passwordAgain = req.param('passwordAgain');

	repository.registerUser(email, password, 'manager', function(isSuccess, errMessage) {
		if (isSuccess) {
			res.render('register/success');
		} else {
			res.render('register/manager', { registrationFormAction: '/register/manager', message: errMessage });
		}
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