'use strict';

var rekuire = require('rekuire');
var repository = rekuire('repository');
var Request = require('tedious').Request;
var router = require('express').Router();
var util = require('util');

router.get('/', function (req, res) {
	var rows = [];

	var request = new Request("SELECT * FROM [dbo].[User]", function (err, rowCount) {
		console.log('Request completed');

		if (err) {
			console.log(err);
		} else {
			console.log(rowCount + ' rows');
			res.render('init', { title: 'DB will be initialized in a moment', dbData: JSON.stringify(rows), registrationFormAction: '/register/admin' });
		}
	});

	request.on('row', function (columns) {
		console.log('Row event fired: ' + columns);
		rows.push(columns);
	});

	repository.connection.execSql(request);
});

module.exports = router;