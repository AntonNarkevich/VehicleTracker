'use strict';

var fs = require('fs');
var router = require('express').Router();

var rekuire = require('rekuire');
var logger = rekuire('logger');
var database = rekuire('database');
var role = rekuire('roleConfiguration');
var keys = rekuire('keys.config.json');
var validate = rekuire('dataValidator');

//Extracted rendering because it's used in 2 roots (get and post).
var renderCreateVehicle = function (res, managerId, validationErrors) {
	database.uspBLManagerGetEmployeesWithoutVehicle(managerId, function (data) {
		res.render('vehicle/create', {
			keys: keys,
			driversInfo: data,
			validationErrors: validationErrors
		});
	});
};

router.get('/create/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	renderCreateVehicle(res, managerId);
});

router.post('/create/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	var name = req.param('name');
	var info = req.param('info');
	var driverId = req.param('driverId');
	var managerId = req.param('ownerId');
	var longitude = req.param('longitude');
	var latitude = req.param('latitude');

	var validationResult = validate.vehicleData({
		name: name,
		info: info,
		longitude: longitude,
		latitude: latitude
	});

	if (!validationResult.isValid) {
		renderCreateVehicle(res, managerId, validationResult.errorMsgs);
	} else {
		database.uspVehicleCreate(managerId, driverId, name, info, longitude, latitude, function (data) {
			res.render('message', {
				messageHeading: 'Vehicle has been created!',
				messageText: 'And successfully assigned to the driver.',
				messageNotice: '*it can be tracked'
			});
		});
	}
});

router.get('/dashboard/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	database.uspVehicleGetVehicleAssignmentInfo(managerId, function (data) {
		res.render('vehicle/dashboard', {keys: keys, vehicleInfos: data});
	});
});

router.get('/:vehicleId/view/:ownerId', role.isAuthenticated(), function (req, res) {
	var vehicleId = req.param('vehicleId');
	var managerId = req.param('ownerId');

	database.uspVehicleGetVehicleFullInfo(vehicleId, function (data) {
		var vehicleInfo = data[0];

		if (vehicleInfo.DriverId) {
			res.render('vehicle/view', {keys: keys, vehicleInfo: vehicleInfo});
		} else {
			database.uspBLManagerGetEmployeesWithoutVehicle(managerId, function (err, driversInfo) {
				res.render('vehicle/view', {keys: keys, vehicleInfo: vehicleInfo, driversInfo: driversInfo});
			});
		}
	});
});

router.post('/:vehicleId/assign/:ownerId', role.is('vehicleOwner'), function (req, res) {
	var vehicleId = req.param('vehicleId');
	var managerId = req.param('ownerId');
	var driverId = req.param('driverId');

	database.uspVehicleAssignToDriver(managerId, vehicleId, driverId, function (data) {
		res.redirect('/v/' + vehicleId + '/view/' + managerId);
	});
});

module.exports = router;