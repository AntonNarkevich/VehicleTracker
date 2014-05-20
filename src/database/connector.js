'use strict';

var tedious = require('tedious');
var Connection = tedious.Connection;

var rekuire = require('rekuire');
var config = rekuire('app.config');
var keys = rekuire('keys.config');
var logger = rekuire('logger');

var dbConnectionConfig = {
	userName: keys.msSqlUserName,
	password: keys.msSqlPassword,
	server: config.msSqlServer,
	options: {
		instanceName: config.msSqlInstanceName
	}
};

var connection = new Connection(dbConnectionConfig);
var isConnected = false;

function connect(dbConnectedCallback) {
	logger.trace('Establishing connection to database.');

	connection.on('connect', function (err) {
			if (err) {
				logger.fatal('Db connection error: ', err);
				dbConnectedCallback(err, null);

				return;
			}

			isConnected = true;
			logger.info('Db connection has been established');

			dbConnectedCallback(null, connection);
		}
	);
}

module.exports = {
	connection: connection,
	isConnected: isConnected,
	connect: connect
};