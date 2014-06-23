'use strict';

var fs = require('fs');

var router = require('express').Router();
var rekuire = require('rekuire');
var async = require('async');
var jade = require('jade');
var _ = require('underscore');
var mime = require('mime');


var logger = rekuire('logger');
var repository = rekuire('repository');
var database = rekuire('database');
var interpreter = rekuire('dataInterpreter');
var role = rekuire('roleStrategy');
var keys = rekuire('keys.config');

//TODO: Add protection against SQL injection.
router.get('/:ownerId/employees', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	database.uspBLManagerGetEmployees(managerId, function (err, data) {
		if (err) {
			logger.error(err);

			throw err;
		}

		res.render('manager/employees', {employeeInfos: data});
	});
});

router.get('/:ownerId/fire/:driverId', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');
	var driverId = req.param('driverId');

	database.uspBLManagerFireDriver(managerId, driverId, function (err, data) {
		if (err) {
			logger.error(err);

			throw err;
		}

		res.redirect('/m/' + managerId + '/employees');
	});
});

router.get('/:ownerId/track', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	res.render('manager/track', {keys: keys, managerId: managerId});
});



router.get('/:ownerId/trackData', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	database.uspTrackGetVehiclePaths(managerId, function (err, data) {
		if (err) {
			logger.error(err);

			throw err;
		}

		var trackInfos = interpreter.interpretTrackInfosData(data);

		res.json(trackInfos);
	});
});

router.get('/:ownerId/statistics', role.is('managerOwner'), function (req, res) {
	var managerId = req.user.id;

	repository.getVehicleIds(managerId, function (err, vehicleIds) {

		var gatherStatisticsTasks = vehicleIds.map(function (vehicleId) {
			return function (callback) {
				repository.getStatistics(vehicleId, function (err, statistics) {
					if (err) {
						callback(err, null);
						return;
					}

					var groupedByDayStatistics = _(statistics).groupBy('EndDate');

					callback(null, {vehicleId: vehicleId, statistics: groupedByDayStatistics});
				});
			};
		});

		//TODO: Multiple requests per single connection are not supported. Connection pool should be used here.
		async.series(gatherStatisticsTasks, function (err, statistics) {
			logger.debug(statistics);
			res.render('manager/statistics', {statistics: statistics});
		});
	});
});

//TODO: Implement pdf export. And remove this pornography.
router.get('/:ownerId/toJSON', role.is('managerOwner'), function (req, res) {
	var managerId = req.user.id;

	repository.getVehicleIds(managerId, function (err, vehicleIds) {

		var gatherStatisticsTasks = vehicleIds.map(function (vehicleId) {
			return function (callback) {
				repository.getStatistics(vehicleId, function (err, statistics) {
					if (err) {
						callback(err, null);
						return;
					}

					var groupedByDayStatistics = _(statistics).groupBy('EndDate');

					callback(null, {vehicleId: vehicleId, statistics: groupedByDayStatistics});
				});
			};
		});

		async.series(gatherStatisticsTasks, function (err, statistics) {
			//TODO: Use app.render here. Render a view, get pdf.

			res.setHeader('Content-disposition', 'attachment; filename=statistics.json');
			res.setHeader("Content-Type", mime.lookup('.json'));

			res.end(JSON.stringify(statistics, null, '\t'));
		});
	});


});

module.exports = router;