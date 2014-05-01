//TODO: Make comments up to date.
/**
 * Exports an instance of ConnectRoles ('connect-roles' module).
 * Configures the following membership rules.
 * Admin has access to all the pages.
 * Manager has access to his private manager pages. Not to other managers' pages.
 * Manager has access to his employee drivers' private pages.
 * Driver has access to his private driver pages.
 * If role is set to 'signedIn' or any other, access is granted for any authenticated user.
 *
 * Usage:
 * router.get('/admin', role.is('admin'), function (req, res) {}
 * router.get('/manager/:managerId', role.is('manager'), function (req, res) {}
 * router.get('/driver/:driverId', role.is('driver'), function (req, res) {}
 * router.get('/signedIn', role.is('signedIn'), function (req, res) {}
 */
'use strict';

var ConnectRoles = require('connect-roles');
var _ = require('underscore');

var rekuire = require('rekuire');
var logger = rekuire('logger');

_.mixin({
	/**
	 * Checks whether user is in role.
	 * @param user - User object should contain roles: ['role1', 'role2'].
	 * @param role - String role name e.g. 'admin'.
	 * @returns {*} - True is user is in role.
	 */
	is: function (user, role) {
		return _.contains(user.roles, role);
	}
});

_.mixin({
	/**
	 * Checks whether manager is boss for driver.
	 * @param driverId - Driver id. should be a number.
	 * @param manager - User object. Should conatin driverIds: [1, 2, 3].
	 * @returns {*} - True is the manager is a boss for the driver.
	 */
	isBossFor: function (manager, driverId) {
		return _.contains(manager.driverIds, driverId);
	}
});

var connectRoles = new ConnectRoles({
	failureHandler: function (req, res, role) {
		if (!req.isAuthenticated()) {
			req.session.returnTo = req.originalUrl;
			res.redirect('/login');
		} else {
			res.status(403);
			res.render('httpError', {
					message: 'Access Denied: You don\'t have ' + role + ' permissions.',
					code: 403
				}
			);
		}
	}
});


connectRoles.use(function (req, action) {
	if (!req.isAuthenticated()) {
		return false;
	}
});

connectRoles.use('signedIn', function(req) {
	if (req.isAuthenticated()) {
		return true;
	}
});

connectRoles.use('driver', function (req) {
	var curUser = req.user;
	var driverId = parseInt(req.param('driverId'), 10);

	if (_(curUser).is('driver') && curUser.id === driverId) {
		return true;
	}
});

connectRoles.use('driver', function (req) {
	var curUser = req.user;
	var driverId = parseInt(req.param('driverId'), 10);

	if (_(curUser).is('manager') && _(curUser).isBossFor(driverId)) {
		return true;
	}
});

connectRoles.use('manager', function (req) {
	var curUser = req.user;
	var managerId = parseInt(req.param('managerId'), 10);

	if (_(curUser).is('manager') && curUser.id === managerId) {
		return true;
	}
});

connectRoles.use(function (req, action) {
	var curUser = req.user;

	if (_(curUser).is('admin')) {
		return true;
	}
});

module.exports = connectRoles;