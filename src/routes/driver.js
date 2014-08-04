'use strict';

var router = require('express').Router();
var rekuire = require('rekuire');
var logger = rekuire('logger');
var repository = rekuire('repository');
var database = rekuire('database');
var role = rekuire('roleStrategy');
var keys = rekuire('keys.config');

//TODO: Add protection against SQL injection.
router.get('/:ownerId', role.isAllOf('driver', 'owner'), function (req, res) {
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

//TODO: New memberhip rule. Only driver owner should have access to his vehicle. (+manager+admin)
router.get('/:vehicleId/positions', role.isAllOf('driver'), function (req, res) {
	var vehicleId = req.param('vehicleId');

	database.uspVehicleGetPositions(vehicleId, function (vehiclePositions) {
		//TODO: How should I treat the error here. (REST api).

		res.json(vehiclePositions);
	});
});

router.post('/:vehicleId/positions', role.is('driver'), function (req, res) {
	var vehicleId = req.param('vehicleId');
	var longitude = req.param('longitude');
	var latitude = req.param('latitude');

	database.uspVehicleSetPositions(vehicleId, longitude, latitude, function (vehiclePositions) {
		//TODO: What to answer if it's just OK? just 200?
		res.json({its:'ok'});
	});
});

module.exports = router;