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