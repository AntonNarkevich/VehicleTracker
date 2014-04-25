'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.end('What is love');

});

router.post('/', function (req, res) {
	console.log(req.body);
	console.log('AJAX POST has been handled');

	res.end('Response to AJAX POST');
});

module.exports = router;