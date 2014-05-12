"use strict";

var rekuire = require('rekuire');
var repository = rekuire('repository');
var logger = rekuire('logger');

repository.establishConnection(function() {
	repository.getVehicleIds('54b030f0-6b22-49b8-9ed2-177e5b0d9001', function(err, vehicleIds) {
		logger.debug(vehicleIds);
	});
});