'use strict';

var Request = require('tedious').Request;
var router = require('express').Router();
var mime = require('mime');

var rekuire = require('rekuire');
var exportDb = rekuire('export');
var logger = rekuire('logger');
var database = rekuire('database');
var role = rekuire('roleStrategy');
var registrationHelper = rekuire('registrationHelper');

router.get('/', function (req, res) {
	database.uspMBSPIsAdminRegistered(function (err, data) {
		var isAdminRegistered = data[0].IsAdminRegistered;

		if (!isAdminRegistered) {
			res.redirect('/register/admin');

			return;
		}

		if (!req.isAuthenticated()) {
			res.redirect('/login');

			return;
		}

		if (req.user.is('admin')) {
			res.redirect('/');

			return;
		}

		res.render('httpError', {
				message: 'You should be admin to view this page.',
				code: 403
			}
		);
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