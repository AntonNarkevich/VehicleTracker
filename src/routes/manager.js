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
var role = rekuire('roleStrategy');
var keys = rekuire('keys.config');

//TODO: Add protection against SQL injection.
router.get('/:ownerId/employees', role.is('managerOwner'), function (req, res) {
	var managerId = req.param('ownerId');

	repository.getDriversInfo(managerId, function (driversInfo) {
		res.render('manager/employees', {driversInfo: driversInfo});
	});
});

router.get('/unemployed', role.is('manager'), function (req, res) {
	repository.getUnemployedDrivers(function (unemployedInfo) {
		res.render('manager/unemployed', {unemployedInfo: unemployedInfo});
	});
});

router.get('/:ownerId/employ/:driverId', role.is('managerOwner'), function (req, res) {
	var ownerId = req.param('ownerId');
	var driverId = req.param('driverId');

	//TODO: Add some kind of protection, error handling.
	repository.employ(ownerId, driverId, function (err, isSuccess) {
		if (isSuccess) {
			res.render('manager/employmentSuccess');
		} else {
			res.render('error', {error: err});
		}
	});
});

router.get('/vehicle/create', role.is('manager'), function (req, res) {
	var managerId = req.user.id;

	repository.getDriversInfo(managerId, function (driversInfo) {
		res.render('vehicle/create', {keys: keys, driversInfo: driversInfo});
	});

});

router.post('/vehicle/create', role.is('manager'), function (req, res) {
	var licensePlate = req.param('licensePlate');
	var driverId = req.param('driverId');
	var managerId = req.user.id;
	var longitude = req.param('longitude');
	var latitude = req.param('latitude');

	//function createVehicle(managerId, driverId, licensePlate, longitude, latitude, done) {

	repository.createVehicle(managerId, driverId, licensePlate, longitude, latitude, function (err) {
		if (err) {
			res.render('error', {error: err});
			return;
		}

		res.render('manager/createVehicleSuccess');
	});
});

router.get('/:ownerId/track', role.is('managerOwner'), function (req, res) {
	var managerId = req.user.id;

	res.render('manager/track', {keys: keys, managerId: managerId});
});

router.get('/:ownerId/trackData', role.is('managerOwner'), function (req, res) {
	var managerId = req.user.id;

	repository.getVehicleTrackInfos(managerId, function (err, vehicleTrackInfos) {
		if (err) {
			res.json(err);
			return;
		}

		res.json(vehicleTrackInfos);
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