'use strict';

var router = require('express').Router();

var _ = require('underscore');
var rekuire = require('rekuire');
var role = rekuire('roleStrategy');
var logger = rekuire('logger');

//TODO: Write to WebStorm about aout-requring/rekuiring.
var database = rekuire('database');

router.get('/:ownerId', role.is('signedIn'), function (req, res) {
	var ownerId = req.param('ownerId');

	database.uspMBSPUserGetWithRoles(ownerId, function (err, data) {
		if (err) {
			logger.error(err);

			throw err;
		}

		var profileInfo = data[0];

		profileInfo.roles = _.chain(data).tail().map(function (roleInfo) {
			return roleInfo.RoleName;
		}).value();

		res.render('profile', { profileInfo: profileInfo });
	});
});

module.exports = router;