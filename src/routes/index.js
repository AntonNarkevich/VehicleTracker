'use strict';

var express = require('express');
var router = express.Router();

var rekuire = require('rekuire');
var keys = rekuire('keys.config.json');

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: 'Express', keys: keys });
});

module.exports = router;
