'use strict';

var router = require('express').Router();

var rekuire = require('rekuire');
var role = rekuire('roleStrategy');

router.get('/', role.is('signedIn'), function (req, res) {
	res.render('profile', { loginFormAction: '/login' });
});

module.exports = router;