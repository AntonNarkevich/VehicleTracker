'use strict';

var Request = require('tedious').Request;
var router = require('express').Router();
var util = require('util');

var rekuire = require('rekuire');
var logger = rekuire('logger');
var role = rekuire('roleStrategy');

router.get('/session', function (req, res) {
	res.end(util.inspect(req.session));
});

router.get('/public', function (req, res) {
	res.end('This is public page.');
});

router.get('/auth', role.isAuthenticated(), function (req, res) {
	res.end('Authenticated.');
});

router.get('/manager', role.is('manager'), function (req, res) {
	res.end('Manager.');
});

router.get('/manager/:ownerId', role.isAllOf('manager', 'owner'), function (req, res) {
	res.end('Manager owner.');
});

router.get('/driver', role.is('driver'), function (req, res) {
	res.end('Driver.');
});

router.get('/driver/:ownerId', role.isAllOf('driver', 'owner'), function (req, res) {
	res.end('Driver owner.');
});

router.get('/driverOrBoss/:ownerId', role.isOneOf('driver', 'boss'), function(req, res) {
	res.end('Driver or his boss');
});

router.get('/admin', role.is('admin'), function(req, res) {
	res.end('Admin.');
});

module.exports = router;
