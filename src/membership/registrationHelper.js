'use strict';

var bcrypt = require('bcrypt');
var rekuire = require('rekuire');
var formValidator = rekuire('formValidator');
var database = rekuire('database');
var logger = rekuire('logger');

var registerInDatabase = function (email, hash, role, callback) {
	database.uspMBSPUserRegister(email, hash, role, function (err, data) {
		//TODO: Move this to data parser.
		//Last data element contains info about uspMBSPUserRegister execution
		var execInfo = data[data.length - 1];

		if (execInfo === undefined && err) {
			logger.error('Unexpected error at uspMBSPUserRegister: ', err);

			throw err;
		}

		if (execInfo.IsSuccess) {
			callback();
		} else {
			callback({errorMessages: [execInfo.Message]});
		}
	});
};

var registerAdminInDatabase = function (email, hash, callback) {
	database.uspMBSPIsAdminRegistered(function (err, data) {
		var isAdminRegistered = data[0].IsAdminRegistered;

		if (isAdminRegistered) {
			callback({errorMessages: ['Admin is already registered.']});

			return;
		}

		registerInDatabase(email, hash, 'admin', callback);
	});
};

var register = function(role, email, password, passwordAgain, callback) {
	//Validation
	var validationResult = formValidator.validate({
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

			throw err;
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