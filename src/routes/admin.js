'use strict';

var router = require('express').Router();
var mime = require('mime');

var rekuire = require('rekuire');
var dbExport = rekuire('dbExport');
var logger = rekuire('logger');
var database = rekuire('database');
var role = rekuire('roleConfiguration');
var interpret = rekuire('dataInterpreter');

router.get('/', function (req, res) {
	database.uspMBSPIsAdminRegistered(function(data) {
		var isAdminRegistered = interpret.isAdminRegistered(data);

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
	dbExport.getExportArray(function (err, zipBuffer) {
		res.setHeader('Content-disposition', 'attachment; filename=vehicleTrackerDatabase.zip');
		res.setHeader("Content-Type", mime.lookup('.zip'));
		res.write(zipBuffer);
		res.end();
	});
});


router.get('/importScript', role.is('admin'), function (req, res) {
	dbExport.getImportScript(function (err, importScript) {
		if (err) {
			logger.error(err);

			throw err;
		}

		res.setHeader('Content-disposition', 'attachment; filename=import.cmd');
		res.setHeader("Content-Type", mime.lookup('.cmd'));
		res.write(importScript);
		res.end();
	});
});

router.get('/deleteAll', role.is('admin'), function (req, res) {
	database.uspUtilDeleteAllData(function(data) {
		req.logout();
		res.redirect('/');
	});
});

module.exports = router;