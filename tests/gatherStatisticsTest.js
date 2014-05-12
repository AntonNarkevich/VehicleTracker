"use strict";

var rekuire = require('rekuire');
var repository = rekuire('repository');
var logger = rekuire('logger');
var async = require('async');

repository.establishConnection(function () {
	var managerId = '54b030f0-6b22-49b8-9ed2-177e5b0d9001';

	repository.getVehicleIds(managerId, function (err, vehicleIds) {

		var gatherStatisticsTasks = vehicleIds.map(function (vehicleId) {
			return function (callback) {
				repository.getStatistics(vehicleId, function (err, statistics) {
					if (err) {
						callback(err, null);
						return;
					}

					callback(null, statistics);
				});
			};
		});

		async.series(gatherStatisticsTasks, function (err, statistics) {
			logger.debug(statistics);
		});
	});
});



