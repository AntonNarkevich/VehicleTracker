'use strict';

var tedious = require('tedious');
var Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = tedious.TYPES;

var rekuire = require('rekuire');
var config = rekuire('app.config');
var keys = rekuire('keys.config');
var logger = rekuire('logger');

var dbConnectionConfig = {
	userName: keys.msSqlUserName,
	password: keys.msSqlPassword,
	server: config.msSqlServer,
	options: {
		port: config.msSqlPort
	}
};

var connection = new Connection(dbConnectionConfig);
var isConnected = false;

function requestCompleteHandler(err, rowCount) {
	if (err) {
		logger.error('Db request failed:', err);
	} else {
		logger.info('Db request has been successfully completed.');
	}
}

function isAdminRegistered(done) {
	var request = new Request("exec dbo.isAdminRegistered @isAdminRegistered output", requestCompleteHandler);

	request.addOutputParameter('isAdminRegistered', TYPES.Bit);

	request.on('returnValue', function (parameterName, value, metadata) {
		var err;

		if (parameterName !== 'isAdminRegistered') {
			err = new Error('isAdminRegistered: Incorrect parameter name. Data can be incorrect.');
		}

		done(err, value);
	});

	connection.execSql(request);
}

function testRequest() {
	var request = new Request("SELECT * FROM [dbo].[Vehicle]", function (err, rowCount) {
		if (err) {
			logger.error(err);
		} else {
			logger.info(rowCount + ' rows');
		}
	});

	request.on('row', function (columns) {
		columns.forEach(function (column) {
			logger.info("%s: %s", column.metadata.colName, column.value);
		});
	});

	connection.execSql(request);
}


function establishConnection(dbConnectedCallback) {
	logger.trace('Establishing connection to database.');

	connection.on('connect', function (err) {
			if (err) {
				logger.fatal('Db connection error ' + err);
			} else {
				logger.info('Db connection has been established');
				isConnected = true;
			}

			dbConnectedCallback(err, connection);
		}
	);
}


module.exports = {
	establishConnection: establishConnection,
	connection: connection,
	isConnected: isConnected,
	isAdminRegistered: isAdminRegistered
};