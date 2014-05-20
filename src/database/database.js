'use strict';

var TYPES = require('tedious').TYPES;

var rekuire = require('rekuire');
var connection = rekuire('connector').connection;
var getInvoker = rekuire('storedProcedureInvoker').getInvoker;

module.exports = {
	uspUserSelect: function (id, callback) {
		var request = getInvoker(
			'usp_User_Select',
			[
				{name: 'Id', type: TYPES.Int, value: id}
			],
			callback
		);

		connection.callProcedure(request);
	}
};