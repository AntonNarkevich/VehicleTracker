//TODO: Break into 2 modules. Write documentation.
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

function registerUser(email, passwordHash, role, registrationDone) {
	var outputParameters = {};

	var request = new Request("exec RegisterUser @email, @passwordHash, @role, @isSuccess output, @errMessage output",
		function () {
			registrationDone(outputParameters.isSuccess, outputParameters.errMessage);
		});

	request.addParameter('email', TYPES.NVarChar, email);
	request.addParameter('passwordHash', TYPES.NVarChar, passwordHash);
	request.addParameter('role', TYPES.NVarChar, role);
	request.addOutputParameter('isSuccess', TYPES.Bit);
	request.addOutputParameter('errMessage', TYPES.NVarChar);

	request.on('returnValue', function (parameterName, value, metadata) {
		logger.trace('Got %s from database: %', parameterName, value);
		outputParameters[parameterName] = value;
	});

	connection.execSql(request);
}

function logInUser(email, passwordHash, logInDone) {
	var outputParameters = {};

	var execStatement = "exec LoginUser " +
		"@email, " +
		"@passwordHash, " +
		"@isSuccess output, " +
		"@errMessage output, " +
		"@userId output, " +
		"@displayName output";

var request = new Request(execStatement, function () {
		var user = {
			id: outputParameters.userId,
			email: email,
			displayName: outputParameters.DriverIdValues,
			roles: outputParameters.RoleNameValues,
			driverIds: outputParameters.DriverIdValues
		};

		logInDone(outputParameters.isSuccess, outputParameters.errMessage, user);
	});

	request.addParameter('email', TYPES.NVarChar, email);
	request.addParameter('passwordHash', TYPES.NVarChar, passwordHash);
	request.addOutputParameter('isSuccess', TYPES.Bit);
	request.addOutputParameter('errMessage', TYPES.NVarChar);
	request.addOutputParameter('userId', TYPES.NVarChar);
	request.addOutputParameter('displayName', TYPES.NVarChar);

	request.on('returnValue', function (parameterName, value, metadata) {
		logger.trace('Got %s from database: %s', parameterName, value);
		outputParameters[parameterName] = value;
	});

	request.on('row', function(columns) {
		columns.forEach(function(column) {
			var colName = column.metadata.colName;

			var outputArrayName = colName + 'Values';
			outputParameters[outputArrayName] = outputParameters[outputArrayName] || [];

			outputParameters[outputArrayName].push(column.value);
		});
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
	isAdminRegistered: isAdminRegistered,
	registerUser: registerUser,
	logInUser: logInUser
};