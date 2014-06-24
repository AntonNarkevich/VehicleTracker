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
var role = rekuire('roleStrategy');
var keys = rekuire('keys.config');

router.get('/create/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	//TODO: Currently it breaks when there is noone to assign the vehicle
	var managerId = req.param('ownerId');

	database.uspBLManagerGetEmployeesWithoutVehicle(managerId, function (err, data) {
		if (err) {
			logger.log(err);

			throw err;
		}

		res.render('vehicle/create', {keys: keys, driversInfo: data});
	});
});

router.get('/dashboard/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	database.uspVehicleGetVehicleAssignmentInfo(managerId, function (err, data) {
		if (err) {
			logger.log(err);

			throw err;
		}

		res.render('vehicle/dashboard', {keys: keys, vehicleInfos: data});
	});
});

//TODO: Probably new role should be added here. 'vehicleOwner' or something.
router.get('/:vehicleId/view/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	var vehicleId = req.param('vehicleId');
	var managerId = req.param('ownerId');

	database.uspVehicleGetVehicleFullInfo(vehicleId, function (err, data) {
		if (err) {
			logger.log(err);

			throw err;
		}

		var vehicleInfo = data[0];

		if (vehicleInfo.DriverId) {
			res.render('vehicle/view', {keys: keys, vehicleInfo: vehicleInfo});
		} else {
			database.uspBLManagerGetEmployeesWithoutVehicle(managerId, function (err, driversInfo) {
				if (err) {
					logger.log(err);

					throw err;
				}

				res.render('vehicle/view', {keys: keys, vehicleInfo: vehicleInfo, driversInfo: driversInfo});
			});
		}
	});
});


//TODO: Probably new role should be added here. 'vehicleOwner' or something.
router.post('/:vehicleId/assign/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	var vehicleId = req.param('vehicleId');
	var managerId = req.param('ownerId');
	var driverId = req.param('driverId');

	database.uspVehicleAssignToDriver(managerId, vehicleId, driverId, function (err, data) {
		if (err) {
			logger.log(err);

			throw err;
		}

		res.redirect('/v/' + vehicleId + '/view/' + managerId);
	});
});






router.post('/create/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	var name = req.param('name');
	var info = req.param('info');
	var driverId = req.param('driverId');
	var managerId = req.param('ownerId');
	var longitude = req.param('longitude');
	var latitude = req.param('latitude');

	database.uspVehicleCreate(managerId, driverId, name, info, longitude, latitude, function (err, data) {
		if (err) {
			logger.log(err);

			throw err;
		}

		res.render('manager/createVehicleSuccess');
	});
});

module.exports = router;