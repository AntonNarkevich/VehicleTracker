'use strict';

var router = require('express').Router();

var _ = require('underscore');
var rekuire = require('rekuire');
var role = rekuire('roleConfiguration');
var logger = rekuire('logger');

//TODO: Write to WebStorm about aout-requring/rekuiring.
var database = rekuire('database');
var interpret = rekuire('dataInterpreter');

router.get('/:ownerId', role.isAuthenticated(), function (req, res) {
	var ownerId = req.param('ownerId');

	database.uspMBSPUserGetProfile(ownerId, function (data) {
		var profile = interpret.profile(data);

		res.render('profile', { profileInfo: profile });
	});
});

module.exports = router;