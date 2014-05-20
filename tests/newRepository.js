'use strict';

var tedious = require('tedious');
var Request = tedious.Request;
var TYPES = tedious.TYPES;
var _ = require('underscore');

var rekuire = require('rekuire');
var repository = rekuire('repository');
var logger = rekuire('logger');

function formStoredProcedureRequest(procedureName, parameters, callback) {

	//parameters => @param1, @param2, @param3
	var parameterNames = _(parameters).map(function (parameter) {
		return '@' + parameter.name;
	}).join(', ');

	//TODO: How to protect this from sql injection?
	var sqlStatement = 'exec ' + procedureName + ' ' + parameterNames;

	var returnedRows = [];

	var request = new Request(sqlStatement, function (err, rowCount) {
		if (err) {
			logger.error('Some error occured while executing stored procedure' + procedureName, err);
			callback(err, null);

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



repository.establishConnection(function (err, connection) {

	var uspUserSelect = function (id, callback) {
		var dbRequest = formStoredProcedureRequest(
			'usp_User_Select',
			[
				{name: 'Id', type: TYPES.Int, value: id}
			],
			callback
		);

		connection.execSql(dbRequest);
	};

	uspUserSelect(8, function(err, users) {
		console.log(users);
	});
});