'use strict';

var Request = require('tedious').Request;
var router = require('express').Router();

var rekuire = require('rekuire');
var logger = rekuire('logger');
var repository = rekuire('repository');

router.get('/init', function (req, res) {
	repository.isAdminRegistered(function(err, isAdminRegistered) {
		if(isAdminRegistered) {
			res.render('httpError', {
					message: 'Init has already happened. Admin is registered.',
					code: 403
				}
			);
		} else {
			res.render('init', { registrationFormAction: '/register/admin' });
		}
	});


});

module.exports = router;