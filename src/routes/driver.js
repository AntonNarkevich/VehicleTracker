'use strict';

var router = require('express').Router();
var rekuire = require('rekuire');
var logger = rekuire('logger');
var database = rekuire('database');
var role = rekuire('roleConfiguration');
var keys = rekuire('keys.config');
var HttpStatus = require('http-status-codes');

router.get('/:ownerId/drive', role.isOneOf('driver', 'boss'), function (req, res) {
	var driverId = req.param('ownerId');

	database.uspVehicleGetByDriverId(driverId, function (data) {
		var vehicleInfo = data[0];

		if (!vehicleInfo) {
			res.render('driver/waitForAVehicle');
		} else {
			res.render('driver/drive', {vehicleInfo: vehicleInfo, keys: keys });
		}
	});
});

router.get('/:vehicleId/positions', role.isOneOf('vehicleOwner', 'driverOfVehicle'), function (req, res) {
	var vehicleId = req.param('vehicleId');

	try {
		database.uspVehicleGetPositions(vehicleId, function (vehiclePositions) {
			res.json(vehiclePositions);
		});
	} catch(err) {
		res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
		res.end();

		throw err;
	}
});

router.post('/:vehicleId/positions', role.isOneOf('vehicleOwner', 'driverOfVehicle'), function (req, res) {
	var vehicleId = req.param('vehicleId');
	//TODO: Is it possible to get sql injection here?
	var longitude = req.param('longitude');
	var latitude = req.param('latitude');

	database.uspVehicleSetPositions(vehicleId, longitude, latitude, function (vehiclePositions) {
		res.statusCode = HttpStatus.OK;
		res.end();
	});
});

module.exports = router;