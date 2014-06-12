'use strict';

var tedious = require('tedious');
var Connection = tedious.Connection;
var ConnectionPool = require('tedious-connection-pool');

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

var pool = new ConnectionPool({}, dbConnectionConfig);

function getConnection(dbConnectedCallback) {
	pool.requestConnection(function (err, connection) {
		logger.trace('Getting connection from the pool.');

		dbConnectedCallback(null, connection);
	});
}

module.exports = {
	getConnection: getConnection
};