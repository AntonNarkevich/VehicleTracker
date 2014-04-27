/**
 * Configures Passport Local Strategy ('passport-local' module).
 * Also provides (de)serialization for Passport Session.
 */
'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var rekuire = require('rekuire');
var logger = rekuire('logger');

var admin = {
	id: 1,
	name: 'Admin id:1',
	roles: ['admin']
};

var driver1 = {
	id: 2,
	name: 'Driver id:2',
	roles: ['driver']
};

var driver2 = {
	id: 3,
	name: 'Driver id:3',
	roles: ['driver']
};

var manager1 = {
	id: 4,
	name: 'Manager id:4',
	roles: ['manager'],
	driverIds: [2, 3]
};

var manager2 = {
	id: 5,
	name: 'Manager id:5',
	roles: ['manager'],
	driverIds: [2]
};

var passportStrategy = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	function (username, password, done) {
		logger.trace('Attempt to login:', username, password);

		switch (username) {
			case '1@asdf':
				done(null, admin);
				break;
			case '2@asdf':
				done(null, driver1);
				break;
			case '3@asdf':
				done(null, driver2);
				break;
			case '4@asdf':
				done(null, manager1);
				break;
			case '5@asdf':
				done(null, manager2);
				break;
			default:
				done(null, admin);
		}
	}
);

var serializeUser = function (user, done) {
	done(null, user.id);

	logger.trace('Serialized user', user);
};

var deserializeUser = function (id, done) {
	switch (id) {
		case 1:
			done(null, admin);
			break;
		case 2:
			done(null, driver1);
			break;
		case 3:
			done(null, driver2);
			break;
		case 4:
			done(null, manager1);
			break;
		case 5:
			done(null, manager2);
			break;
		default:
			done(null, admin);
	}

	logger.trace('Deserializing user', id);
};

/**
 * Exports object containing configuration for Passport Local Strategy and Passport Session.
 * @type {{passportStrategy: LocalStrategy, serializeUser: function, deserializeUser: function}}
 *
 * Usage:
 * passport.use(authStrategy.passportStrategy);
 * app.use(passport.initialize());
 *
 * passport.serializeUser(authStrategy.serializeUser);
 * passport.deserializeUser(authStrategy.deserializeUser);
 * app.use(passport.session());
 */
module.exports = {
	passportStrategy: passportStrategy,
	serializeUser: serializeUser,
	deserializeUser: deserializeUser
};