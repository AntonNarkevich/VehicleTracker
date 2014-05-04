"use strict";

var rekuire = require('rekuire');
var repository = rekuire('repository');
var logger = rekuire('logger');

repository.establishConnection(function() {
	console.log('what is love');

	repository.getDriversInfo('54b030f0-6b22-49b8-9ed2-177e5b0d9001', function(driversInfo) {
		logger.debug(driversInfo);
	});
});