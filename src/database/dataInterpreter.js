'use strict';

var _ = require('underscore');

module.exports = {
	/**
	 * Interpretes UspMBSPUserGetProfile data.
	 * @param data
	 */
	profile: function (data) {
		//data array:
		//[0] scalar user properties.
		//[1..n] other user info
		var user = data[0];

		//Collecting row names
		var roleNames = _.chain(data)
			.tail()
			.filter(function (dataRow) {
				return dataRow.RoleName;
			})
			.map(function (roleNameRow) {
				return roleNameRow.RoleName;
			})
			.value();

		if (roleNames.length !== 0) {
			user.RoleNames = roleNames;
		}

		//For managers
		if (roleNames.indexOf('manager') !== -1) {
			var driverInfos = _.chain(data)
				.tail()
				.filter(function (dataRow) {
					return dataRow.DriverId;
				})
				.value();

			if (driverInfos.length !== 0) {
				user.DriverInfos = driverInfos;
			}

			var vehicleInfos = _.chain(data)
				.tail()
				.filter(function (dataRow) {
					return dataRow.VehicleId;
				})
				.value();

			if (vehicleInfos.length !== 0) {
				user.VehicleInfos = vehicleInfos;
			}
		}

		//For drivers
		if (roleNames.indexOf('driver') !== -1) {
			var bossInfo = _.chain(data)
				.tail()
				.find(function (dataRow) {
					return dataRow.BossId;
				})
				.value();

			user.isEmployed = bossInfo !== undefined;

			if (user.isEmployed) {
				user.BossId = bossInfo.BossId;
				user.BossEmail = bossInfo.BossEmail;
			}

			user.VehicleInfo = _.chain(data)
				.tail()
				.find(function (dataRow) {
					return dataRow.VehicleId;
				})
				.value();
		}

		return user;
	},

	trackInfos: function (data) {
		return _.chain(data)
			.groupBy('Id')
			.map(function (vehiclePositionInfos, vehicleId){
				var positions = _(vehiclePositionInfos).map(function (vehiclePositionInfo) {
					return {
						longitude: vehiclePositionInfo.Longitude,
						latitude: vehiclePositionInfo.Latitude,
						date: vehiclePositionInfo.CheckoutDate
					};
				});

				var vehicleName = vehiclePositionInfos[0].Name;

				return {
					vehicleName: vehicleName,
					vehicleId: vehicleId,
					positions: positions

				};
			})
			.value();
	},

	managerVehiclesStatistics: function (data) {
		return _.chain(data)
			.groupBy('VehicleId')
			.map(function (vehicleStatistics, vehicleId) {

				var groupedByDayStatistics = _(vehicleStatistics).groupBy('EndDate');

				return [vehicleId, groupedByDayStatistics];
			})
			.object()
			.value();
	},

	userRegister: function (data) {
		//Last data element contains info about uspMBSPUserRegister execution
		return  data[data.length - 1];
	},

	isAdminRegistered: function(data) {
		return data[0].IsAdminRegistered;
	}
};