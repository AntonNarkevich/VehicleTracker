'use strict';

var validator = require('validator');

function validate(formData) {
	//Server-side validation
	var errorMsgs = [];

	if (formData.email !== undefined && !validator.isEmail(formData.email)) {
		errorMsgs.push('Email should be valid.');
	}

	if (formData.password !== undefined && !validator.isLength(formData.password, 6)) {
		errorMsgs.push('This value is too short. It should have 6 characters or more.');
	}

	if (formData.passwordAgain !== undefined && !validator.equals(formData.password, formData.passwordAgain)) {
		errorMsgs.push('Passwords don\'t match.');
	}

	return {
		isValid: errorMsgs.length === 0,
		errorMsgs: errorMsgs
	};
}

module.exports = { validate: validate };