//TODO: Update comments
/**
 * Configures Passport Local Strategy ('passport-local' module).
 * Also provides (de)serialization for Passport Session.
 */
'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var rekuire = require('rekuire');
var _ = require('underscore');
var logger = rekuire('logger');
var database = rekuire('database');
var interpreter = rekuire('dataInterpreter');
var bcrypt = require('bcrypt');
var formValidator = rekuire('formValidator');


var passportStrategy = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	function (email, password, done) {
		logger.trace('Attempt to login:', email, password);

		database.uspMBSPUserGetByEmail(email, function (data) {
			if (data.length === 0) {
				done(null, false, { message: 'Email or password is incorrect.' });

				return;
			}

			var user = data[0];
			var pwdHash = user.PasswordHash;

			bcrypt.compare(password, pwdHash, function (err, isTruePassword) {
				if (err) {
					logger.error(err);

					throw err;
				}

				if (isTruePassword) {
					done(null, user);
				} else {
					done(null, false, { message: 'Email or password is incorrect.' });
				}
			});
		});
	}
);

var serializeUser = function (user, done) {
	done(null, user.Id);

	logger.trace('Serialized user. Id: ', user.Id);
};

var deserializeUser = function (id, done) {
	database.uspMBSPUserGetProfile(id, function (data) {
		var user = interpreter.interpretProfileData(data);

		done(null, user);

		logger.trace('Deserializing user: ', user);
	});
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