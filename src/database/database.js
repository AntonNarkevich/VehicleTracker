'use strict';

var TYPES = require('tedious').TYPES;

var rekuire = require('rekuire');
var connection = rekuire('connector').connection;
var getInvoker = rekuire('storedProcedureInvoker').getInvoker;

module.exports = {
	uspBLDriverRejectPendingJobOffers: function (driverId,  callback) {
		var request = getInvoker(
			'usp_BL_Driver_RejectPendingJobOffers',
			[
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspBLManagerEmployDriver: function (managerId, driverId,  callback) {
		var request = getInvoker(
			'usp_BL_Manager_EmployDriver',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId},
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspBLManagerGetDriverIds: function (managerId,  callback) {
		var request = getInvoker(
			'usp_BL_Manager_GetDriverIds',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspBLManagerIsEmployerFor: function (managerId, driverId,  callback) {
		var request = getInvoker(
			'usp_BL_Manager_IsEmployerFor',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId},
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspJobOfferAccept: function (SenderId, RecieverId,  callback) {
		var request = getInvoker(
			'usp_JobOffer_Accept',
			[
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspJobOfferDelete: function (SenderId, RecieverId,  callback) {
		var request = getInvoker(
			'usp_JobOffer_Delete',
			[
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspJobOfferGetByRecieverId: function (recieverId,  callback) {
		var request = getInvoker(
			'usp_JobOffer_GetByRecieverId',
			[
				{name: 'recieverId', type: TYPES.Int, value: recieverId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspJobOfferGetBySenderId: function (senderId,  callback) {
		var request = getInvoker(
			'usp_JobOffer_GetBySenderId',
			[
				{name: 'senderId', type: TYPES.Int, value: senderId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspJobOfferInsert: function (SenderId, RecieverId, OfferStatus, OfferDate, DecisionDate,  callback) {
		var request = getInvoker(
			'usp_JobOffer_Insert',
			[
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId},
				{name: 'OfferStatus', type: TYPES.VarChar, value: OfferStatus},
				{name: 'OfferDate', type: undefined, value: OfferDate},
				{name: 'DecisionDate', type: undefined, value: DecisionDate}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspJobOfferReject: function (SenderId, RecieverId,  callback) {
		var request = getInvoker(
			'usp_JobOffer_Reject',
			[
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspJobOfferSelect: function (SenderId, RecieverId,  callback) {
		var request = getInvoker(
			'usp_JobOffer_Select',
			[
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspJobOfferUpdate: function (SenderId, RecieverId, OfferStatus, OfferDate, DecisionDate,  callback) {
		var request = getInvoker(
			'usp_JobOffer_Update',
			[
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId},
				{name: 'OfferStatus', type: TYPES.VarChar, value: OfferStatus},
				{name: 'OfferDate', type: undefined, value: OfferDate},
				{name: 'DecisionDate', type: undefined, value: DecisionDate}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspMBSPRoleGetIdByName: function (roleName,  callback) {
		var request = getInvoker(
			'usp_MBSP_Role_GetIdByName',
			[
				{name: 'roleName', type: TYPES.VarChar, value: roleName}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspMBSPUserAddRole: function (userId, roleName,  callback) {
		var request = getInvoker(
			'usp_MBSP_User_AddRole',
			[
				{name: 'userId', type: TYPES.Int, value: userId},
				{name: 'roleName', type: TYPES.VarChar, value: roleName}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspMBSPUserGetByEmail: function (Email,  callback) {
		var request = getInvoker(
			'usp_MBSP_User_GetByEmail',
			[
				{name: 'Email', type: TYPES.VarChar, value: Email}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspMBSPUserGetRolesById: function (Id,  callback) {
		var request = getInvoker(
			'usp_MBSP_User_GetRolesById',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspMBSPUserGetWithRoles: function (Id,  callback) {
		var request = getInvoker(
			'usp_MBSP_User_GetWithRoles',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspMBSPUserRegister: function (Email, PasswordHash, Role,  callback) {
		var request = getInvoker(
			'usp_MBSP_User_Register',
			[
				{name: 'Email', type: TYPES.VarChar, value: Email},
				{name: 'PasswordHash', type: TYPES.VarChar, value: PasswordHash},
				{name: 'Role', type: TYPES.VarChar, value: Role}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspMBSPUserRemoveRole: function (userId, roleName,  callback) {
		var request = getInvoker(
			'usp_MBSP_User_RemoveRole',
			[
				{name: 'userId', type: TYPES.Int, value: userId},
				{name: 'roleName', type: TYPES.VarChar, value: roleName}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspMessageDelete: function (Id,  callback) {
		var request = getInvoker(
			'usp_Message_Delete',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspMessageInsert: function (SenderId, RecieverId, MessageText, IsRead,  callback) {
		var request = getInvoker(
			'usp_Message_Insert',
			[
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId},
				{name: 'MessageText', type: TYPES.NVarChar, value: MessageText},
				{name: 'IsRead', type: TYPES.Bit, value: IsRead}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspMessageSelect: function (Id,  callback) {
		var request = getInvoker(
			'usp_Message_Select',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspMessageUpdate: function (Id, SenderId, RecieverId, MessageText, IsRead,  callback) {
		var request = getInvoker(
			'usp_Message_Update',
			[
				{name: 'Id', type: TYPES.Int, value: Id},
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId},
				{name: 'MessageText', type: TYPES.NVarChar, value: MessageText},
				{name: 'IsRead', type: TYPES.Bit, value: IsRead}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspUserDelete: function (Id,  callback) {
		var request = getInvoker(
			'usp_User_Delete',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspUserInsert: function (Name, Email, PasswordHash, IsBlocked,  callback) {
		var request = getInvoker(
			'usp_User_Insert',
			[
				{name: 'Name', type: TYPES.NVarChar, value: Name},
				{name: 'Email', type: TYPES.VarChar, value: Email},
				{name: 'PasswordHash', type: TYPES.VarChar, value: PasswordHash},
				{name: 'IsBlocked', type: TYPES.Bit, value: IsBlocked}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspUserSelect: function (Id,  callback) {
		var request = getInvoker(
			'usp_User_Select',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspUserUpdate: function (Id, Name, Email, PasswordHash, IsBlocked,  callback) {
		var request = getInvoker(
			'usp_User_Update',
			[
				{name: 'Id', type: TYPES.Int, value: Id},
				{name: 'Name', type: TYPES.NVarChar, value: Name},
				{name: 'Email', type: TYPES.VarChar, value: Email},
				{name: 'PasswordHash', type: TYPES.VarChar, value: PasswordHash},
				{name: 'IsBlocked', type: TYPES.Bit, value: IsBlocked}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspVehicleAssignToDriver: function (vehicleId, driverId,  callback) {
		var request = getInvoker(
			'usp_Vehicle_AssignToDriver',
			[
				{name: 'vehicleId', type: TYPES.Int, value: vehicleId},
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspVehicleDelete: function (Id,  callback) {
		var request = getInvoker(
			'usp_Vehicle_Delete',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspVehicleGetByDriverId: function (driverId,  callback) {
		var request = getInvoker(
			'usp_Vehicle_GetByDriverId',
			[
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspVehicleGetByManagerId: function (managerId,  callback) {
		var request = getInvoker(
			'usp_Vehicle_GetByManagerId',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspVehicleInsert: function (ManagerId, Name, Info,  callback) {
		var request = getInvoker(
			'usp_Vehicle_Insert',
			[
				{name: 'ManagerId', type: TYPES.Int, value: ManagerId},
				{name: 'Name', type: TYPES.NVarChar, value: Name},
				{name: 'Info', type: TYPES.NVarChar, value: Info}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspVehicleSelect: function (Id,  callback) {
		var request = getInvoker(
			'usp_Vehicle_Select',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);

		connection.callProcedure(request);
	},

	uspVehicleUpdate: function (Id, ManagerId, Name, Info,  callback) {
		var request = getInvoker(
			'usp_Vehicle_Update',
			[
				{name: 'Id', type: TYPES.Int, value: Id},
				{name: 'ManagerId', type: TYPES.Int, value: ManagerId},
				{name: 'Name', type: TYPES.NVarChar, value: Name},
				{name: 'Info', type: TYPES.NVarChar, value: Info}
			],
			callback
		);

		connection.callProcedure(request);
	}
};
