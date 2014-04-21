'use strict';

var rekuire = require('rekuire');
var config = rekuire('config');
var keys = rekuire('keys');

var tedious = require('tedious');
var Connection = tedious.Connection;
var Request = tedious.Request;


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

function establishConnection(dbConnectedCallback) {
	console.log('Establishing connection to database.');

	connection.on('connect', function (err) {
			if (err) {
				console.log('Db connection error ' + err);
			} else {
				console.log('Db connection has been established');
				isConnected = true;
			}

			dbConnectedCallback(err, connection);
		}
	);
}

module.exports = {
	establishConnection: establishConnection,
	connection: connection,
	isConnected: isConnected
};

//function executeStatement() {
//	var request = new Request("SELECT * FROM [dbo].[Vehicle]", function (err, rowCount) {
//		if (err) {
//			console.log(err);
//		} else {
//			console.log(rowCount + ' rows');
//		}
//	});
//
//	request.on('row', function (columns) {
//		columns.forEach(function (column) {
//			console.log("%s: %s", column.metadata.colName, column.value);
//		});
//	});
//
//	connection.execSql(request);
//}