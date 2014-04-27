'use strict';

var Request = require('tedious').Request;
var router = require('express').Router();
var util = require('util');

var rekuire = require('rekuire');
var logger = rekuire('logger');
var repository = rekuire('repository');
var role = rekuire('roleStrategy');

router.get('/session', function (req, res) {
	res.end(util.inspect(req.session));
});

router.get('/auth', role.is('signedIn'), function (req, res) {
	res.end('You are authenticated if you see this.\n');

});

router.get('/driver/:driverId', role.is('driver'), function (req, res) {
	var driverId = req.param('driverId');

	res.write('You are driver ' + driverId + ' if you see this.\n');
	res.write('Or his manager.\n');
	res.end('Or admin.');
});

router.get('/manager/:managerId', role.is('manager'), function (req, res) {
	var managerId = req.param('managerId');

	res.write('You are manager ' + managerId + ' if you see this.\n');
	res.end('Or admin.');
});

router.get('/admin', role.is('admin'), function (req, res) {
	res.end('You are admin if you see this.');
});

module.exports = router;
