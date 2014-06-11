'use strict';

var Request = require('tedious').Request;
var _ = require('underscore');

var rekuire = require('rekuire');
var logger = rekuire('logger');

function getInvoker(procedureName, parameters, callback) {
	var returnedRows = [];

	var request = new Request(procedureName, function (err, rowCount) {
		if (err) {
			logger.error('Some error occured while executing stored procedure ' + procedureName, err);
			callback(err, returnedRows);

			return;
		}

		logger.trace('Stored procedure ' + procedureName + ' has been executed successfully.');
		callback(null, returnedRows);
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

module.exports = {
	getInvoker: getInvoker
};