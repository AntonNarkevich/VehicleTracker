//TODO: Update comments
/**
 * Configures Passport Local Strategy ('passport-local' module).
 * Also provides (de)serialization for Passport Session.
 */
'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var rekuire = require('rekuire');
var logger = rekuire('logger');
var repository = rekuire('repository');

var passportStrategy = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	function (username, password, done) {
		logger.trace('Attempt to login:', username, password);

		repository.logInUser(username, password, function(isSuccess, errMessage, user) {
			if(!isSuccess) {
				done(null, false, { message: errMessage });
				return;
			}

			done(null, user);
		});
	}
);

var serializeUser = function (user, done) {
	//TODO. Save only id inf session.
	done(null, JSON.stringify(user));

	logger.trace('Serialized TO JSON user', user);
};

var deserializeUser = function (id, done) {
	//TODO: Write a stored procedure to get info from DB. Not from JSON.
	var user = JSON.parse(id);

	logger.trace('Deserializing FROM JSON user', id);
	logger.debug(user);

	done(null, user);
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