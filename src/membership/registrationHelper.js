'use strict';

var bcrypt = require('bcrypt');

var rekuire = require('rekuire');
var validate = rekuire('dataValidator');
var database = rekuire('database');
var logger = rekuire('logger');
var interpret = rekuire('dataInterpreter');

var registerInDatabase = function (email, hash, role, callback) {
	database.uspMBSPUserRegister(email, hash, role, function (data) {
		var execInfo = interpret.userRegister(data);

		if (execInfo.IsSuccess) {
			callback();
		} else {
			callback({errorMessages: [execInfo.Message]});
		}
	});
};

var registerAdminInDatabase = function (email, hash, callback) {
	database.uspMBSPIsAdminRegistered(function (data) {
		var isAdminRegistered = interpret.isAdminRegistered(data);

		if (isAdminRegistered) {
			callback({errorMessages: ['Admin is already registered.']});

			return;
		}

		registerInDatabase(email, hash, 'admin', callback);
	});
};

var register = function(role, email, password, passwordAgain, callback) {
	//Validation
	var validationResult = validate.registerData({
		email: email,
		password: password,
		passwordAgain: passwordAgain
	});

	if (!validationResult.isValid) {
		callback({errorMessages: validationResult.errorMsgs});

		return;
	}

	//Validation is passed. Registring.
	bcrypt.hash(password, 10, function (err, hash) {
		if (err) {
			logger.error(err);
			callback({errorMessages: ['Internal server error.']});

			return;
		}

		logger.trace('Registring ' + role + ' with hash: ', hash);

		if (role === 'admin') {
			registerAdminInDatabase(email, hash, callback);
		} else {
			registerInDatabase(email, hash, role, callback);
		}
	});
};

module.exports = { register: register };