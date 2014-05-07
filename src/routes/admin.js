'use strict';

var Request = require('tedious').Request;
var router = require('express').Router();
var mime = require('mime');

var rekuire = require('rekuire');
var exportDb = rekuire('export');
var logger = rekuire('logger');
var repository = rekuire('repository');
var role = rekuire('roleStrategy');

router.get('/init', function (req, res) {
	repository.isAdminRegistered(function (err, isAdminRegistered) {
		if (isAdminRegistered) {
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

router.get('/export', role.is('admin'), function (req, res) {
	exportDb.getExportArray(function (err, zipBuffer) {
		//TODO: Wht is mime abbreviation?
		res.setHeader('Content-disposition', 'attachment; filename=vehicleTrackerDatabase.zip');
		res.setHeader("Content-Type", mime.lookup('.zip'));
		res.write(zipBuffer);
		res.end();
	});
});

module.exports = router;