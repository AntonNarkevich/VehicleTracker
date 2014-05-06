//TODO: Break into 2 modules. Write documentation.
'use strict';

var tedious = require('tedious');
var Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = tedious.TYPES;
var util = require('util');
var _ = require('underscore');

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

	request.on('row', function (columns) {
		columns.forEach(function (column) {
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

function getDriversInfo(managerId, done) {
	var driverInfoRows = [];

	//TODO: Write to TEDIOUS why can't I use UniqueIdentifier parameter here. It throws error.
	var sqlStatement = util.format("exec dbo.GetDriversInfo '%s'", managerId);


	var request = new Request(sqlStatement, function (err, rowCount) {
		if (err) {
			logger.error('getDriverInfos ' + err);
		} else {
			done(driverInfoRows);
			logger.info('getDriverInfos completed.');
		}
	});

	request.on('row', function (columns) {
		var curDriverInfoRow = {};

		columns.forEach(function (column) {
			curDriverInfoRow[column.metadata.colName] = column.value;
			logger.info("getDriverInfos: %s: %s", column.metadata.colName, column.value);
		});

		driverInfoRows.push(curDriverInfoRow);
	});

	connection.execSql(request);
}

function getProfile(userId, done) {
	var profileInfo = {};

	//TODO: Write to TEDIOUS why can't I use UniqueIdentifier parameter here. It throws error.
	var sqlStatement = util.format("exec dbo.GetProfile '%s'", userId);


	var request = new Request(sqlStatement, function (err, rowCount) {
		if (err) {
			logger.error('getProfile ' + err);
		} else {
			done(profileInfo);
			logger.info('getProfile completed.');
		}
	});

	//TODO:There can be more than one row. Becaue user can be in 2 roles. So it will handle only last role.
	request.on('row', function (columns) {
		columns.forEach(function (column) {
			profileInfo[column.metadata.colName] = column.value;
			logger.info("getProfile: %s: %s", column.metadata.colName, column.value);
		});
	});

	connection.execSql(request);
}
function getUnemployedDrivers(done) {
	var unemployedDriversInfo = [];

	var request = new Request('exec GetUnemployedDrivers', function (err, rowCount) {
		if (err) {
			logger.error('getUnemployedDrivers ' + err);
		} else {
			done(unemployedDriversInfo);
			logger.info('getUnemployedDrivers completed.');
		}
	});

	request.on('row', function (columns) {
		var curDriverInfoRow = {};

		columns.forEach(function (column) {
			curDriverInfoRow[column.metadata.colName] = column.value;
			logger.info("getUnemployedDrivers: %s: %s", column.metadata.colName, column.value);
		});

		unemployedDriversInfo.push(curDriverInfoRow);
	});

	connection.execSql(request);
}

function employ(managerId, driverId, done) {

	var sqlStatement = util.format("exec dbo.Employ '%s', '%s'", managerId, driverId);

	var request = new Request(sqlStatement, function (err, rowCount) {
		if (err) {
			done(err, false);
			logger.error('employ ' + err);
		} else {
			done(null, true);
			logger.info('employ completed.');
		}
	});

	connection.execSql(request);
}

function createVehicle(managerId, driverId, licensePlate, longitude, latitude, done) {

	var sqlStatement = util.format("exec dbo.CreateVehicle '%s', '%s', @licensePlate, @longitude, @latitude", managerId, driverId);

	var request = new Request(sqlStatement, function (err, rowCount) {
		if (err) {
			done(err, false);
			logger.error('createVehicle ' + err);
		} else {
			done(null, true);
			logger.info('createVehicle completed.');
		}
	});

	request.addParameter('licensePlate', TYPES.NVarChar, licensePlate);
	request.addParameter('longitude', TYPES.NVarChar, longitude);
	request.addParameter('latitude', TYPES.NVarChar, latitude);

	connection.execSql(request);
}

function getVehicle(driverId, done) {
	var vehicleInfo = {};

	var sqlStatement = util.format("exec dbo.GetVehicle '%s'", driverId);

	var request = new Request(sqlStatement, function (err, rowCount) {
		if (err) {
			logger.error('getVehicle ' + err);
			done(err, null);
		} else {
			done(null, vehicleInfo);
			logger.info('getVehicle completed.');
		}
	});

	request.on('row', function (columns) {
		columns.forEach(function (column) {
			vehicleInfo[column.metadata.colName] = column.value;
			logger.info("getVehicle: %s: %s", column.metadata.colName, column.value);
		});
	});

	connection.execSql(request);
}

function getVehiclePositions(vehicleId, done) {
	var vehiclePositions = [];

	var sqlStatement = util.format("exec dbo.GetVehiclePositions '%s'", vehicleId);

	var request = new Request(sqlStatement, function (err, rowCount) {
		if (err) {
			logger.error('getVehiclePositions ' + err);
			done(err, null);
		} else {
			done(null, vehiclePositions);
			logger.info('getVehiclePositions completed.');
		}
	});

	request.on('row', function (columns) {
		var vehiclePosition = {};
		columns.forEach(function (column) {
			var colName = column.metadata.colName;

			vehiclePosition[colName] = column.value;
		});

		vehiclePositions.push(vehiclePosition);
	});

	connection.execSql(request);
}


function setVehiclePosition(vehicleId, longitude, latitude, done) {
	var sqlStatement = util.format("exec dbo.SetVehiclePosition '%s', @longitude, @latitude", vehicleId);

	var request = new Request(sqlStatement, function (err, rowCount) {
		if (err) {
			done(err, false);
			logger.error('setVehiclePosition ' + err);
		} else {
			done(null, true);
			logger.info('setVehiclePosition completed.');
		}
	});

	request.addParameter('longitude', TYPES.NVarChar, longitude);
	request.addParameter('latitude', TYPES.NVarChar, latitude);

	connection.execSql(request);
}

//exec getVehicleTrackInfos '54b030f0-6b22-49b8-9ed2-177e5b0d9001'

function getVehicleTrackInfos(managerId, done) {
	var vehicleTrackInfoRows = [];

	var sqlStatement = util.format("exec dbo.GetVehicleTrackInfos '%s'", managerId);

	var request = new Request(sqlStatement, function (err, rowCount) {
		if (err) {
			logger.error('getVehicleTrackInfos ' + err);
			done(err, null);
		} else {
			//!!Process it here
			var vehicleTrackInfos = _.chain(vehicleTrackInfoRows)
				.map(function(vehicleTrackInfoRow) {
					return {
						vehicleId: vehicleTrackInfoRow.Id,
						date: vehicleTrackInfoRow.Date,
						positionInfo: {
							Longitude: vehicleTrackInfoRow.Longitude,
							Latitude: vehicleTrackInfoRow.Latitude
						}
					};
				})
				.groupBy('vehicleId')
				.values()
				.value();

			done(null, vehicleTrackInfos);
			logger.info('getVehicleTrackInfos completed.');
		}
	});

	request.on('row', function (columns) {
		var vehicleTrackInfoRow = {};
		columns.forEach(function (column) {
			var colName = column.metadata.colName;

			vehicleTrackInfoRow[colName] = column.value;
		});

		vehicleTrackInfoRows.push(vehicleTrackInfoRow);
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
	logInUser: logInUser,
	getDriversInfo: getDriversInfo,
	getProfile: getProfile,
	getUnemployedDrivers: getUnemployedDrivers,
	employ: employ,
	createVehicle: createVehicle,
	getVehicle: getVehicle,
	getVehiclePositions: getVehiclePositions,
	setVehiclePosition: setVehiclePosition,
	getVehicleTrackInfos: getVehicleTrackInfos
};