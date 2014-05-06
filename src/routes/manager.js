'use strict';

var router = require('express').Router();
var rekuire = require('rekuire');
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

	repository.createVehicle(managerId, driverId, licensePlate, longitude, latitude, function(err) {
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




module.exports = router;