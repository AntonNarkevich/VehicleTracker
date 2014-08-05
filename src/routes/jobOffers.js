'use strict';

var router = require('express').Router();
var _ = require('underscore');

var rekuire = require('rekuire');
var logger = rekuire('logger');
var database = rekuire('database');
var role = rekuire('roleConfiguration');
var keys = rekuire('keys.config.json');

router.get('/:ownerId', role.isOneOf('manager', 'driver'), role.is('owner'), role.isNot('employed'), function (req, res) {
	var managerId = parseInt(req.param('ownerId'), 10);

	var isManager = req.userIs('manager');
	var roleName = isManager ? 'manager' : 'driver';

	var dataModel = {
		isManagerMode: isManager,
		isDriverMode: !isManager
	};

	database.uspBLGetOfferableUsers(managerId, roleName, function (data) {
		dataModel.offerableUserInfos = data;

		res.render('jobOffers/dashboard', dataModel);
	});
});

router.get('/:ownerId/offer/:receiverId', role.isOneOf('manager', 'driver'), role.is('owner'), function (req, res) {
	var managerId = req.param('ownerId');
	var receiverId = req.param('receiverId');

	database.uspJobOfferMakeOffer(managerId, receiverId, function (data) {
		res.redirect('/jobOffers/' + managerId);
	});
});

router.get('/:ownerId/reject/:senderId', role.isOneOf('manager', 'driver'), role.is('owner'), function (req, res) {
	var receiverId = req.param('ownerId');
	var senderId = req.param('senderId');

	database.uspJobOfferReject(senderId, receiverId, function (data) {
		res.redirect('/jobOffers/' + receiverId);
	});
});

router.get('/:ownerId/accept/:senderId', role.isOneOf('manager', 'driver'), role.is('owner'), function (req, res) {
	var managerId;
	var driverId;

	var isCurrentUserManager = req.userIs('manager');

	if(isCurrentUserManager) {
		managerId = req.param('ownerId');
		driverId = req.param('senderId');
	} else {
		managerId = req.param('senderId');
		driverId = req.param('ownerId');
	}

	database.uspBLManagerEmployDriver(managerId, driverId, function (data) {
		if (_(req.user).is('driver')) {
			res.redirect('/');
		} else {
			res.redirect('/jobOffers/' + req.user.Id);
		}
	});
});

module.exports = router;