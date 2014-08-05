'use strict';

var bcrypt = require('bcrypt');

var rekuire = require('rekuire');
var formValidator = rekuire('formValidator');
var database = rekuire('database');
var logger = rekuire('logger');
var interpreter = rekuire('dataInterpreter');

var registerInDatabase = function (email, hash, role, callback) {
	database.uspMBSPUserRegister(email, hash, role, function (data) {
		var execInfo = interpreter.interpretUserRegisterData(data);

		if (execInfo.IsSuccess) {
			callback();
		} else {
			callback({errorMessages: [execInfo.Message]});
		}
	});
};

var registerAdminInDatabase = function (email, hash, callback) {
	database.uspMBSPIsAdminRegistered(function (data) {
		var isAdminRegistered = interpreter.interpretIsAdminRegisteredData(data);

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