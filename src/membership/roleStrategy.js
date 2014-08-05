/**
 * Exports fully configured instance of ConnectRoles ('connect-roles' module) with all the membership rules.
 * Usage:
 * router.get('/auth', role.isAuthenticated(), function (req, res) {}
 * router.get('/admin', role.is('admin'), function (req, res) {}
 * router.get('/manager/:ownerId', role.is('manager'), function (req, res) {}
 * router.get('/driver/:ownerId', role.is('driver'), function (req, res) {}
 * router.get('/:ownerId', role.isOneOf('manager', 'driver'), role.is('owner'), role.isNot('employed'), function (req, res) {}
 * router.get('/:ownerId/employees', role.isAllOf('manager', 'owner'), function (req, res) {}
 */

'use strict';

var ConnectRoles = require('connect-roles');

var rekuire = require('rekuire');
var _ = rekuire('roleUnderscoreMixins');
var logger = rekuire('logger');
var roleRules = rekuire('roleRules');


var accessDeniedHandler = function (req, res, role) {
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
};

var connectRoles = new ConnectRoles({
	failureHandler: accessDeniedHandler
});

/*Adding role rules such as managers, drivers etc.*/
roleRules.configure(connectRoles);


/*Additional functions to combine roles.*/
connectRoles.isNot = function (role) {
	return function (req, res, next) {
		if (!req.userIs(role)) {
			next();
		} else {
			accessDeniedHandler(req, res, 'not-' + role);
		}
	};
};

/**
 * Access is granted when user at least one role from the array.
 * @param [arguments] Role names
 * @returns {Function} Route middleware.
 */
connectRoles.isOneOf = function () {
	var slice = Array.prototype.slice;
	var roles = slice.apply(arguments);

	return function (req, res, next) {
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
connectRoles.isAllOf = function () {
	var slice = Array.prototype.slice;
	var roles = slice.apply(arguments);

	return function (req, res, next) {
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