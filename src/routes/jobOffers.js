'use strict';

var fs = require('fs');

var router = require('express').Router();
var rekuire = require('rekuire');
var async = require('async');
var jade = require('jade');
var _ = require('underscore');

var logger = rekuire('logger');
var repository = rekuire('repository');
var database = rekuire('database');
var interpreter = rekuire('dataInterpreter');
var role = rekuire('roleStrategy');
var keys = rekuire('keys.config');

//TODO: Create 'unemployed' role
router.get('/:ownerId', role.isOneOf('manager', 'driver'), function (req, res) {
	var managerId = parseInt(req.param('ownerId'), 10);

	var isManager = req.userIs('manager');
	var roleName = isManager ? 'manager' : 'driver';

	var dataModel = {
		isManagerMode: isManager,
		isDriverMode: !isManager
	};

	database.uspBLManagerGetOfferableUsers(managerId, roleName, function (err, data) {
		if (err) {
			logger.error(err);

			throw err;
		}

		dataModel.offerableUserInfos = data;

		res.render('jobOffers/dashboard', dataModel);
	});
});

router.get('/:ownerId/offer/:receiverId', role.isOneOf('manager', 'driver'), role.is('owner'), function (req, res) {
	var managerId = req.param('ownerId');
	var receiverId = req.param('receiverId');

	database.uspJobOfferOfferJob(managerId, receiverId, function (err, data) {
		if (err) {
			logger.error(err);

			throw err;
		}

		res.redirect('/jobOffers/' + managerId);
	});
});

router.get('/:ownerId/reject/:senderId', role.isOneOf('manager', 'driver'), role.is('owner'), function (req, res) {
	var receiverId = req.param('ownerId');
	var senderId = req.param('senderId');

	database.uspJobOfferReject(senderId, receiverId, function (err, data) {
		if (err) {
			logger.error(err);

			throw err;
		}

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

	database.uspBLManagerEmployDriver(managerId, driverId, function (err, data) {
		if (err) {
			logger.error(err);

			throw err;
		}

		res.redirect('/jobOffers/' + req.user.Id);
	});
});

module.exports = router;