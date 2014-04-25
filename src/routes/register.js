'use strict';

var rekuire = require('rekuire');
var repository = rekuire('repository');
var Request = require('tedious').Request;
var router = require('express').Router();
var util = require('util');

router.get('/admin', function (req, res) {
	res.end('register admin');

});

router.get('/owner', function (req, res) {
	res.end('register owner');
});

router.get('/driver', function (req, res) {
	res.end('register driver');
});

module.exports = router;