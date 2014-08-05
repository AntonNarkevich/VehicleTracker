'use strict';

var _ = require('underscore');

/*Utility underscore mixins*/
_.mixin({
	/**
	 * Checks whether user is in role.
	 * @param user - User object should contain roles: ['role1', 'role2'].
	 * @param role - String role name e.g. 'admin'.
	 * @returns {*} - True is user is in role.
	 */
	is: function (user, role) {
		return _.contains(user.RoleNames, role);
	}
});

_.mixin({
	/**
	 * Checks whether manager is boss for driver.
	 * @param driverId - Driver id. should be a number.
	 * @param manager - User object. Should conatin driverIds: [1, 2, 3].
	 * @returns {*} - True is the manager is a boss for the driver.
	 */
	isBossFor: function (manager, driverId) {
		var driverInfo =  _.find(manager.DriverInfos, function (driverInfo) {
			return driverInfo.DriverId === driverId;
		});

		return !!driverInfo;
	}
});

_.mixin({
	isDriverOf: function (driver, vehicleId) {
		var vehicleInfo = driver.VehicleInfo;

		return vehicleInfo && vehicleInfo.Id === vehicleId;
	}
});

_.mixin({
	isVehicleOwner: function (manager, vehicleId) {
		var vehicleInfo = _.find(manager.VehicleInfos, function (vehicleInfo, index) {
			return vehicleInfo.VehicleId === vehicleId;
		});

		return !!vehicleInfo;
	}
});

module.exports = _;