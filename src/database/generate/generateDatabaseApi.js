'use strict';

var TYPES = require('tedious').TYPES;

var rekuire = require('rekuire');
var invoker = rekuire('storedProcedureInvoker');
var connector = rekuire('connector');
var connection = rekuire('connector').connection;

var ejs = require('ejs');

var path = require('path');
var fs = require('fs');

var _ = require('underscore');
var _s = require('underscore.string');

var FILENAME = path.normalize('databaseApi.ejs');
var OUTPUT_FILENAME = path.normalize('../database.js');

var getStoredProcedures = function (callback) {
	invoker.invoke('usp_UTIL_GetStoredProcedures', [], callback);
};

getStoredProcedures(function (err, storedProcedures) {
	var sqlToTedious = {
		'int': 'TYPES.Int',
		'nvarchar': 'TYPES.NVarChar',
		'varchar': 'TYPES.VarChar',
		'bit': 'TYPES.Bit'
	};

	var proceduresInfo = _.chain(storedProcedures)
		.each(function (row) {
			row.jsName = row.ParameterName.replace('@', '');
			row.tediousType = sqlToTedious[row.ParameterType];
		})
		.groupBy('ProcedureName')
		.map(function (args, procedureName) {
			return {
				sqlName: procedureName,
				jsName: _s.camelize(procedureName),
				args: args
			};
		})
		.each(function (procInfo) {
			procInfo.jsArgsString = _(procInfo.args)
				.map(function (arg) {
					return arg.jsName + ', ';
				})
				.join('');
		});

	fs.readFile(FILENAME, function (err, data) {
		if (err) {
			console.error(err);
		}

		var jsApi = ejs.render(data.toString(), { procedures: proceduresInfo });

		console.log('Compiled');

		fs.writeFile(OUTPUT_FILENAME, jsApi, function (err) {
			if (err) {
				throw err;
			}

			console.log('Written to %s', OUTPUT_FILENAME);
		});
	});

	console.log(storedProcedures);
});
