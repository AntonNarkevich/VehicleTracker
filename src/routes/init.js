'use strict';

var Request = require('tedious').Request;
var router = require('express').Router();

var rekuire = require('rekuire');
var logger = rekuire('logger');
var repository = rekuire('repository');

router.get('/', function (req, res) {
	var rows = [];

	var request = new Request("SELECT * FROM [dbo].[User]", function (err, rowCount) {
		logger.trace('Request to dababase has been completed');

		if (err) {
			logger.error(err);
			res.render('error', err);
		}

		logger.trace('Read rows from dababase: ' + rowCount);
		res.render('init',
			{ title: 'DB will be initialized in a moment',
				dbData: JSON.stringify(rows),
				registrationFormAction: '/register/admin'
			});
	});

	request.on('row', function (columns) {
		logger.debug('Row event fired: ' + columns);
		rows.push(columns);
	});

	repository.connection.execSql(request);
});

module.exports = router;