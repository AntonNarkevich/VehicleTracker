/**
 * Server-side validation
 */

'use strict';

var validator = require('validator');

var loginData = function (data) {
	var errorMsgs = [];

	if (!validator.isEmail(data.email)) {
		errorMsgs.push('Email should be valid.');
	}

	if (!validator.isLength(data.password, 6)) {
		errorMsgs.push('This value is too short. It should have 6 characters or more.');
	}

	return {
		isValid: errorMsgs.length === 0,
		errorMsgs: errorMsgs
	};
};

var registerData = function (data) {
	//Validating like login data.
	var validationResult = loginData(data);
	var errorMsgs = validationResult.errorMsgs;

	//Then checking passwords to be equal.
	if (!validator.equals(data.password, data.passwordAgain)) {
		errorMsgs.push('Passwords don\'t match.');
	}

	return {
		isValid: errorMsgs.length === 0,
		errorMsgs: errorMsgs
	};
};

var vehicleData = function (data) {
	var errorMsgs = [];

	if (!validator.isLength(data.name, 5, 30)) {
		errorMsgs.push('Vehicle name should be between 5 and 30 symbols.');
	}

	if (!validator.isLength(data.info, 0, 600)) {
		errorMsgs.push('Vehicle info max length is 600 symbols.');
	}

	var floatLatitude = validator.toFloat(data.latitude);
	if (!(-90 <= floatLatitude && floatLatitude <= 90)) {
		errorMsgs.push('Latitude should be between -90 and 90.');
	}

	var floatLongitude = validator.toFloat(data.longitude);
	if (!(-180 <= floatLongitude && floatLongitude <= 180)) {
		errorMsgs.push('Longitude should be between -180 and 180.');
	}

	return {
		isValid: errorMsgs.length === 0,
		errorMsgs: errorMsgs
	};
};

module.exports = {
	loginData: loginData,
	registerData: registerData,
	vehicleData: vehicleData
};