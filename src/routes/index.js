'use strict';

var rekuire = require('rekuire');

var keys = rekuire('keys');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: 'Express', keys: keys });
});

module.exports = router;
