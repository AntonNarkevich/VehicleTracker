'use strict';

var _ = require('underscore');

module.exports = {
	/**
	 * Interpretes UspMBSPUserGetProfile data.
	 * @param data
	 */
	interpretProfileData: function (data) {
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

	interpretTrackInfosData: function (data) {
		return _.chain(data)
			.map(function(vehicleTrackInfoRow) {
				return {
					vehicleId: vehicleTrackInfoRow.Id,
					vehicleName: vehicleTrackInfoRow.Name,
					date: vehicleTrackInfoRow.CheckoutDate,
					positionInfo: {
						Longitude: vehicleTrackInfoRow.Longitude,
						Latitude: vehicleTrackInfoRow.Latitude
					}
				};
			})
			.groupBy('vehicleId')
			.values()
			.value();
	},

	interpretManagerVehiclesStatisticsData: function (data) {
		return _.chain(data)
			.groupBy('VehicleId')
			.map(function (vehicleStatistics, vehicleId) {

				var groupedByDayStatistics = _(vehicleStatistics).groupBy('EndDate');

				return [vehicleId, groupedByDayStatistics];
			})
			.object()
			.value();
	},

	interpretUserRegisterData: function (data) {
		//Last data element contains info about uspMBSPUserRegister execution
		return  data[data.length - 1];
	},

	interpretIsAdminRegisteredData: function(data) {
		return data[0].IsAdminRegistered;
	}
};