'use strict';

var _ = require('underscore');
var inflection = require('inflection');


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

		var driverInfos = _.chain(data)
			.tail()
			.filter(function (dataRow) {
				return dataRow.DriverId;
			})
			.value();

		if (driverInfos.length !== 0) {
			user.DriverInfos = driverInfos;
		}

		return user;
	}
};