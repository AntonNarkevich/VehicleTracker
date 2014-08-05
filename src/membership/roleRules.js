'use strict';

var rekuire = require('rekuire');
var _ = rekuire('roleUnderscoreMixins');

var configure = function (connectRoles) {
	//If user is not signed in access is forbidden.
	connectRoles.use(function (req, action) {
		if (!req.isAuthenticated()) {
			return false;
		}
	});

	//E.g. "Drive" page for particular driver or "Employees" page for a manager
	connectRoles.use('owner', function (req) {
		var curUser = req.user;
		var ownerId = parseInt(req.param('ownerId'), 10);

		if (curUser.Id === ownerId) {
			return true;
		}
	});

	//Driver pages
	connectRoles.use('driver', function (req) {
		var curUser = req.user;

		if (_(curUser).is('driver')) {
			return true;
		}
	});

	connectRoles.use('driverOfVehicle', function (req) {
		var curUser = req.user;
		var vehicleId = parseInt(req.param('vehicleId'), 10);

		if (_(curUser).isDriverOf(vehicleId)) {
			return true;
		}
	});

	//Employed driver pages
	connectRoles.use('employed', function (req) {
		var curUser = req.user;

		if (curUser.isEmployed) {
			return true;
		}
	});

	//Manager pages
	connectRoles.use('manager', function (req) {
		var curUser = req.user;

		if (_(curUser).is('manager')) {
			return true;
		}
	});

	connectRoles.use('boss', function (req) {
		var curUser = req.user;
		var driverId = parseInt(req.param('ownerId'), 10);

		if (_(curUser).isBossFor(driverId)) {
			return true;
		}
	});

	connectRoles.use('vehicleOwner', function (req) {
		var curUser = req.user;
		var vehicleId = parseInt(req.param('vehicleId'), 10);

		if (_(curUser).isVehicleOwner(vehicleId)) {
			return true;
		}
	});

	//Admin pages
	connectRoles.use('admin', function (req) {
		var curUser = req.user;

		if (_(curUser).is('admin')) {
			return true;
		}
	});

	//Admin gets access to everything
	connectRoles.use(function (req, action) {
		var curUser = req.user;

		if (_(curUser).is('admin')) {
			return true;
		}
	});
};

module.exports = { configure: configure };