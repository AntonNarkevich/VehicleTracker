'use strict'

var rekuire = require('rekuire');
var connector = rekuire('connector');
var database = rekuire('databaseApi');

connector.connect(function (err) {
	if (err) {
		throw err;
	}

	database.uspVehicleSelect(195, function (err, vehicles) {
		var v = vehicles[0];

		console.log(v);

		database.uspVehicleUpdate(v.Id, v.ManagerId, v.Name + '-Huexus', null, function (err, vehicle) {

			database.uspVehicleSelect(195, function (err, vehicle) {
				console.log(vehicle[0]);
			});
		});
	});
});

