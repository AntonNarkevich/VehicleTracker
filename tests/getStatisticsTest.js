"use strict";

var rekuire = require('rekuire');
var repository = rekuire('repository');
var logger = rekuire('logger');

repository.establishConnection(function() {
	repository.getStatistics('26DFC5DD-3EA3-41AD-89AA-8B04A60DB1B8', function(err, movementInfos) {
		logger.debug(movementInfos);
	});
});