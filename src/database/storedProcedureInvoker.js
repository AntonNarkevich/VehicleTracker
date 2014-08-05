'use strict';

var Request = require('tedious').Request;
var _ = require('underscore');

var rekuire = require('rekuire');
var logger = rekuire('logger');
var connector = rekuire('connector');

/**
 * Creates Request (tedious) object for s.p. execution.
 * @param procedureName
 * @param parameters
 * @param callback
 * @returns {Request}
 */
function getInvoker(procedureName, parameters, callback) {
	var returnedRows = [];

	var request = new Request(procedureName, function (err, rowCount) {
		if (err) {
			logger.error('Some error occured while executing stored procedure ' + procedureName, err);

			throw err;
		}

		logger.trace('Stored procedure ' + procedureName + ' has been executed successfully.');
		callback(returnedRows);
	});

	parameters.forEach(function (parameter) {
		request.addParameter(parameter.name, parameter.type, parameter.value);
	});

	request.on('row', function (columns) {
		var row = _.chain(columns)
			.map(function (column) {
				var columnName = column.metadata.colName;
				var colValue = column.value;

				return [columnName, colValue];
			})
			.object()
			.value();

		returnedRows.push(row);
	});

	return request;
}

/**
 * Gets a connection from the pool.
 * Executes s.p. on it.
 * Returns the connection to the pool.
 */
function invoke(procedureName, parameters, callback) {
	connector.getConnection(function (err, connection) {
		if (err) {
			logger.error('Error connecting to db: ', err);

			//Dangerous err throwing.
			throw err;
		}

		//Wrapping use defined callback to close the connection.
		var request = getInvoker(procedureName, parameters, function(returnedRows) {
			//Return connection to the pool.
			logger.trace('Returing connection to the pool.');
			connection.close();

			callback(returnedRows);
		});

		connection.on('connect', function(err) {
			if (err) {
				logger.fatal('Db connection error: ', err);

				throw err;
			}

			logger.trace('Connection established. Calling procedure.');
			connection.callProcedure(request);
		});
	});
}

module.exports = {
	invoke: invoke
};