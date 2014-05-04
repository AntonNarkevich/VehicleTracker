'use strict';

var router = require('express').Router();
var rekuire = require('rekuire');
var logger = rekuire('logger');
var repository = rekuire('repository');
var role = rekuire('roleStrategy');
var keys = rekuire('keys.config');

//TODO: Add protection against SQL injection.
router.get('/:ownerId', role.is('driverOwner'), function (req, res) {
	var driverId = req.param('ownerId');

	repository.getVehicle(driverId, function (err, vehicleInfo) {
		if (err) {
			res.render('error', {error: err});
			return;
		}

		if (!vehicleInfo.Id) {
			res.render('driver/waitForAVehicle');
			return;
		}

		res.render('driver/drive', {vehicleInfo: vehicleInfo, keys: keys });
	});
});

//TODO: New memberhip rule. Only driver owner should have access to his vehicle. (+manager+admin)
router.get('/:vehicleId/positions', role.is('driver'), function (req, res) {
	var vehicleId = req.param('vehicleId');

	repository.getVehiclePositions(vehicleId, function (err, vehiclePositions) {
		if (err) {
			//TODO: How should I treat the error here. (REST api).
			res.json(err);
			return;
		}

		res.json(vehiclePositions);
	});
});

router.post('/:vehicleId/positions', role.is('driver'), function (req, res) {
	var vehicleId = req.param('vehicleId');
	var longitude = req.param('longitude');
	var latitude = req.param('latitude');

	repository.setVehiclePosition(vehicleId, longitude, latitude, function (err, vehiclePositions) {
		if (err) {
			res.json(err);
			return;
		}

		//TODO: What to answer if it's just OK? just 200?
		res.json({its:'ok'});
	});
});



module.exports = router;