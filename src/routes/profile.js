'use strict';

var router = require('express').Router();

var rekuire = require('rekuire');
var role = rekuire('roleStrategy');
//TODO: Write to WebStorm about aout-requring/rekuiring.
var repository = rekuire('repository');

router.get('/:ownerId', role.is('signedIn'), function (req, res) {
	var ownerId = req.param('ownerId');

	repository.getProfile(ownerId, function(profileInfo) {
		res.render('profile', { profileInfo: profileInfo });
	});
});

module.exports = router;