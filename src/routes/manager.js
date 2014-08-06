'use strict';

var fs = require('fs');

var router = require('express').Router();
var rekuire = require('rekuire');
var async = require('async');
var jade = require('jade');
var _ = require('underscore');
var mime = require('mime');

var logger = rekuire('logger');
var database = rekuire('database');
var interpret = rekuire('dataInterpreter');
var role = rekuire('roleConfiguration');
var keys = rekuire('keys.config');

router.get('/:ownerId/employees', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	database.uspBLManagerGetEmployees(managerId, function (data) {
		res.render('manager/employees', {employeeInfos: data});
	});
});

//TODO: The driver should be able to quit. Currently only manager can fire.
router.get('/:ownerId/fire/:driverId', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');
	var driverId = req.param('driverId');

	database.uspBLManagerFireDriver(managerId, driverId, function (data) {
		res.redirect('/m/' + managerId + '/employees');
	});
});

router.get('/:ownerId/track', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	res.render('manager/track', {keys: keys, managerId: managerId});
});

router.get('/:ownerId/trackData', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	database.uspTrackGetVehiclePaths(managerId, function (data) {
		var trackInfos = interpret.trackInfos(data);

		res.json(trackInfos);
	});
});

router.get('/:ownerId/statistics', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	database.uspTrackGetManagerVehiclesStatistics(managerId, function (data) {
		var statistics = interpret.managerVehiclesStatistics(data);

		res.render('manager/statistics', {statistics: statistics});
	});
});

//TODO: Implement pdf export.
router.get('/:ownerId/toJSON', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	database.uspTrackGetManagerVehiclesStatistics(managerId, function (data) {
		var statistics = interpret.managerVehiclesStatistics(data);

		res.setHeader('Content-disposition', 'attachment; filename=statistics.json');
		res.setHeader("Content-Type", mime.lookup('.json'));

		res.end(JSON.stringify(statistics, null, '\t'));
	});
});

module.exports = router;