'use strict';

var express = require('express');
var router = express.Router();

var rekuire = require('rekuire');
var logger = rekuire('logger');
var role = rekuire('roleStrategy');

router.get('/', function (req, res) {
	res.render('index');
});

router.post('/', function (req, res) {
	logger.debug('Posistions page. Ajax post has been handled. Request body:');
	logger.debug(req.body);

	res.end('Response to AJAX POST');
});

module.exports = router;