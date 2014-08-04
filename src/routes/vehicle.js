'use strict';

var fs = require('fs');
var router = require('express').Router();

var rekuire = require('rekuire');
var logger = rekuire('logger');
var database = rekuire('database');
var role = rekuire('roleStrategy');
var keys = rekuire('keys.config.json');

router.get('/create/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	database.uspBLManagerGetEmployeesWithoutVehicle(managerId, function (data) {
		res.render('vehicle/create', {keys: keys, driversInfo: data});
	});
});

router.post('/create/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	var name = req.param('name');
	var info = req.param('info');
	var driverId = req.param('driverId');
	var managerId = req.param('ownerId');
	var longitude = req.param('longitude');
	var latitude = req.param('latitude');

	//TODO: Server-side validation should be performed here.
	database.uspVehicleCreate(managerId, driverId, name, info, longitude, latitude, function (data) {
		res.render('manager/createVehicleSuccess');
	});
});

router.get('/dashboard/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	var managerId = req.param('ownerId');

	database.uspVehicleGetVehicleAssignmentInfo(managerId, function (data) {
		res.render('vehicle/dashboard', {keys: keys, vehicleInfos: data});
	});
});

//TODO: Probably new role should be added here. 'vehicleOwner' or something.
router.get('/:vehicleId/view/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	var vehicleId = req.param('vehicleId');
	var managerId = req.param('ownerId');

	database.uspVehicleGetVehicleFullInfo(vehicleId, function (data) {
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

	database.uspVehicleAssignToDriver(managerId, vehicleId, driverId, function (data) {
		res.redirect('/v/' + vehicleId + '/view/' + managerId);
	});
});


module.exports = router;