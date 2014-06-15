//TODO: Make comments up to date.
//TODO: Make documentation for managerOwers and managers.
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
var database = rekuire('database');

_.mixin({
	/**
	 * Checks whether user is in role.
	 * @param user - User object should contain roles: ['role1', 'role2'].
	 * @param role - String role name e.g. 'admin'.
	 * @returns {*} - True is user is in role.
	 */
	is: function (user, role) {
		return _.contains(user.RoleNames, role);
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
		return _.contains(manager.DriverIds, driverId);
	}
});

function accessDeniedHandler (req, res, role) {
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

var connectRoles = new ConnectRoles({
	failureHandler: accessDeniedHandler
});

//Rules are for users with roles.
//So if user is not signed in access is forbidden.
connectRoles.use(function (req, action) {
	if (!req.isAuthenticated()) {
		return false;
	}
});

//Driver pages
connectRoles.use('driver', function (req) {
	var curUser = req.user;

	if (_(curUser).is('driver')) {
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

//Admin pages
connectRoles.use('admin', function (req) {
	var curUser = req.user;

	if (_(curUser).is('admin')) {
		return true;
	}
});

//TODO: Do I need an article here?
//E.g. "Drive" page for particular driver
//or "Employees" page for a manager
connectRoles.use('owner', function (req) {
	var curUser = req.user;
	var ownerId = parseInt(req.param('ownerId'), 10);

	if (curUser.Id === ownerId) {
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

//Admin gets access to everything
connectRoles.use(function (req, action) {
	var curUser = req.user;

	if (_(curUser).is('admin')) {
		return true;
	}
});

/**
 * Access is granted when user at least one role from the array.
 * @param [arguments] Role names
 * @returns {Function} Route middleware.
 */
connectRoles.isOneOf = function() {
	var slice = Array.prototype.slice;
	var roles = slice.apply(arguments);

	return function(req, res, next) {
		var isGranted = false;

		if (req.isAuthenticated()) {
			//If one of roles exist access is granted.
			roles.forEach(function (role) {
				if (req.userIs(role)) {
					isGranted = true;
				}
			});
		}

		if (isGranted) {
			next();
		} else {
			accessDeniedHandler(req, res, 'one of: ' + roles.join(', '));
		}
	};
};

/**
 * Access is granted only if user has all the roles.
 * @param [arguments] Role names
 * @returns {Function} Route middleware.
 */
connectRoles.isAllOf = function() {
	var slice = Array.prototype.slice;
	var roles = slice.apply(arguments);

	return function(req, res, next) {
		var isGranted = false;

		if (req.isAuthenticated()) {
			//If one of roles does not exist.
			//Access is denied.
			isGranted = true;

			roles.forEach(function (role) {
				if (!req.userIs(role)) {
					isGranted = false;
				}
			});
		}

		if (isGranted) {
			next();
		} else {
			accessDeniedHandler(req, res, 'all: ' + roles.join(', '));
		}
	};
};

module.exports = connectRoles;