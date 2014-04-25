'use strict';

var rekuire = require('rekuire');
var router = require('express').Router();

router.get('/', function (req, res) {
	res.render('login', { loginFormAction: '/login' });
});

router.post('/', function (req, res) {
	res.end('You have POSTed credentials');
});

module.exports = router;