'use strict';

var TYPES = require('tedious').TYPES;

var rekuire = require('rekuire');
var connection = rekuire('connector').connection;
var invoker = rekuire('storedProcedureInvoker');

module.exports = {

	uspBLDriverGetBoss: function (driverId,  callback) {
		invoker.invoke(
			'usp_BL_Driver_GetBoss',
			[
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);
	},

	uspBLDriverRejectPendingJobOffers: function (driverId,  callback) {
		invoker.invoke(
			'usp_BL_Driver_RejectPendingJobOffers',
			[
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);
	},

	uspBLGetOfferableUsers: function (userId, userRole,  callback) {
		invoker.invoke(
			'usp_BL_GetOfferableUsers',
			[
				{name: 'userId', type: TYPES.Int, value: userId},
				{name: 'userRole', type: TYPES.VarChar, value: userRole}
			],
			callback
		);
	},

	uspBLManagerEmployDriver: function (managerId, driverId,  callback) {
		invoker.invoke(
			'usp_BL_Manager_EmployDriver',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId},
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);
	},

	uspBLManagerFireDriver: function (managerId, driverId,  callback) {
		invoker.invoke(
			'usp_BL_Manager_FireDriver',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId},
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);
	},

	uspBLManagerGetDriverIds: function (managerId,  callback) {
		invoker.invoke(
			'usp_BL_Manager_GetDriverIds',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId}
			],
			callback
		);
	},

	uspBLManagerGetEmployees: function (managerId,  callback) {
		invoker.invoke(
			'usp_BL_Manager_GetEmployees',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId}
			],
			callback
		);
	},

	uspBLManagerGetEmployeesWithoutVehicle: function (managerId,  callback) {
		invoker.invoke(
			'usp_BL_Manager_GetEmployeesWithoutVehicle',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId}
			],
			callback
		);
	},

	uspBLManagerIsBossFor: function (managerId, driverId,  callback) {
		invoker.invoke(
			'usp_BL_Manager_IsBossFor',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId},
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);
	},

	uspBLManagerIsVehicleOwner: function (managerId, vehicleId,  callback) {
		invoker.invoke(
			'usp_BL_Manager_IsVehicleOwner',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId},
				{name: 'vehicleId', type: TYPES.Int, value: vehicleId}
			],
			callback
		);
	},

	uspJobOfferAccept: function (SenderId, RecieverId,  callback) {
		invoker.invoke(
			'usp_JobOffer_Accept',
			[
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId}
			],
			callback
		);
	},

	uspJobOfferDelete: function (Id,  callback) {
		invoker.invoke(
			'usp_JobOffer_Delete',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);
	},

	uspJobOfferGetByRecieverId: function (recieverId,  callback) {
		invoker.invoke(
			'usp_JobOffer_GetByRecieverId',
			[
				{name: 'recieverId', type: TYPES.Int, value: recieverId}
			],
			callback
		);
	},

	uspJobOfferGetBySenderAndReceiver: function (SenderId, RecieverId,  callback) {
		invoker.invoke(
			'usp_JobOffer_GetBySenderAndReceiver',
			[
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId}
			],
			callback
		);
	},

	uspJobOfferGetBySenderId: function (senderId,  callback) {
		invoker.invoke(
			'usp_JobOffer_GetBySenderId',
			[
				{name: 'senderId', type: TYPES.Int, value: senderId}
			],
			callback
		);
	},

	uspJobOfferInsert: function (SenderId, RecieverId, OfferStatus, OfferDate, DecisionDate,  callback) {
		invoker.invoke(
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
	},

	uspJobOfferMakeOffer: function (senderId, recieverId,  callback) {
		invoker.invoke(
			'usp_JobOffer_MakeOffer',
			[
				{name: 'senderId', type: TYPES.Int, value: senderId},
				{name: 'recieverId', type: TYPES.Int, value: recieverId}
			],
			callback
		);
	},

	uspJobOfferReject: function (SenderId, RecieverId,  callback) {
		invoker.invoke(
			'usp_JobOffer_Reject',
			[
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId}
			],
			callback
		);
	},

	uspJobOfferSelect: function (Id,  callback) {
		invoker.invoke(
			'usp_JobOffer_Select',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);
	},

	uspJobOfferUpdate: function (Id, SenderId, RecieverId, OfferStatus, OfferDate, DecisionDate,  callback) {
		invoker.invoke(
			'usp_JobOffer_Update',
			[
				{name: 'Id', type: TYPES.Int, value: Id},
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId},
				{name: 'OfferStatus', type: TYPES.VarChar, value: OfferStatus},
				{name: 'OfferDate', type: undefined, value: OfferDate},
				{name: 'DecisionDate', type: undefined, value: DecisionDate}
			],
			callback
		);
	},

	uspMBSPRoleGetIdByName: function (roleName,  callback) {
		invoker.invoke(
			'usp_MBSP_Role_GetIdByName',
			[
				{name: 'roleName', type: TYPES.VarChar, value: roleName}
			],
			callback
		);
	},

	uspMBSPUserAddRole: function (userId, roleName,  callback) {
		invoker.invoke(
			'usp_MBSP_User_AddRole',
			[
				{name: 'userId', type: TYPES.Int, value: userId},
				{name: 'roleName', type: TYPES.VarChar, value: roleName}
			],
			callback
		);
	},

	uspMBSPUserGetByEmail: function (Email,  callback) {
		invoker.invoke(
			'usp_MBSP_User_GetByEmail',
			[
				{name: 'Email', type: TYPES.VarChar, value: Email}
			],
			callback
		);
	},

	uspMBSPUserGetProfile: function (Id,  callback) {
		invoker.invoke(
			'usp_MBSP_User_GetProfile',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);
	},

	uspMBSPUserGetRolesById: function (Id,  callback) {
		invoker.invoke(
			'usp_MBSP_User_GetRolesById',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);
	},

	uspMBSPUserRegister: function (Email, PasswordHash, Role,  callback) {
		invoker.invoke(
			'usp_MBSP_User_Register',
			[
				{name: 'Email', type: TYPES.VarChar, value: Email},
				{name: 'PasswordHash', type: TYPES.VarChar, value: PasswordHash},
				{name: 'Role', type: TYPES.VarChar, value: Role}
			],
			callback
		);
	},

	uspMBSPUserRemoveRole: function (userId, roleName,  callback) {
		invoker.invoke(
			'usp_MBSP_User_RemoveRole',
			[
				{name: 'userId', type: TYPES.Int, value: userId},
				{name: 'roleName', type: TYPES.VarChar, value: roleName}
			],
			callback
		);
	},

	uspMessageDelete: function (Id,  callback) {
		invoker.invoke(
			'usp_Message_Delete',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);
	},

	uspMessageInsert: function (SenderId, RecieverId, MessageText, IsRead,  callback) {
		invoker.invoke(
			'usp_Message_Insert',
			[
				{name: 'SenderId', type: TYPES.Int, value: SenderId},
				{name: 'RecieverId', type: TYPES.Int, value: RecieverId},
				{name: 'MessageText', type: TYPES.NVarChar, value: MessageText},
				{name: 'IsRead', type: TYPES.Bit, value: IsRead}
			],
			callback
		);
	},

	uspMessageSelect: function (Id,  callback) {
		invoker.invoke(
			'usp_Message_Select',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);
	},

	uspMessageUpdate: function (Id, SenderId, RecieverId, MessageText, IsRead,  callback) {
		invoker.invoke(
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
	},

	uspUserDelete: function (Id,  callback) {
		invoker.invoke(
			'usp_User_Delete',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);
	},

	uspUserInsert: function (Name, Email, PasswordHash, IsBlocked,  callback) {
		invoker.invoke(
			'usp_User_Insert',
			[
				{name: 'Name', type: TYPES.NVarChar, value: Name},
				{name: 'Email', type: TYPES.VarChar, value: Email},
				{name: 'PasswordHash', type: TYPES.VarChar, value: PasswordHash},
				{name: 'IsBlocked', type: TYPES.Bit, value: IsBlocked}
			],
			callback
		);
	},

	uspUserSelect: function (Id,  callback) {
		invoker.invoke(
			'usp_User_Select',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);
	},

	uspUserUpdate: function (Id, Name, Email, PasswordHash, IsBlocked,  callback) {
		invoker.invoke(
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
	},

	uspVehicleAssignToDriver: function (managerId, vehicleId, driverId,  callback) {
		invoker.invoke(
			'usp_Vehicle_AssignToDriver',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId},
				{name: 'vehicleId', type: TYPES.Int, value: vehicleId},
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);
	},

	uspVehicleCreate: function (managerId, driverId, name, info, longitude, latitude,  callback) {
		invoker.invoke(
			'usp_Vehicle_Create',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId},
				{name: 'driverId', type: TYPES.Int, value: driverId},
				{name: 'name', type: TYPES.NVarChar, value: name},
				{name: 'info', type: TYPES.NVarChar, value: info},
				{name: 'longitude', type: TYPES.NVarChar, value: longitude},
				{name: 'latitude', type: TYPES.NVarChar, value: latitude}
			],
			callback
		);
	},

	uspVehicleDelete: function (Id,  callback) {
		invoker.invoke(
			'usp_Vehicle_Delete',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);
	},

	uspVehicleGetByDriverId: function (driverId,  callback) {
		invoker.invoke(
			'usp_Vehicle_GetByDriverId',
			[
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);
	},

	uspVehicleGetByManagerId: function (managerId,  callback) {
		invoker.invoke(
			'usp_Vehicle_GetByManagerId',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId}
			],
			callback
		);
	},

	uspVehicleInsert: function (ManagerId, Name, Info,  callback) {
		invoker.invoke(
			'usp_Vehicle_Insert',
			[
				{name: 'ManagerId', type: TYPES.Int, value: ManagerId},
				{name: 'Name', type: TYPES.NVarChar, value: Name},
				{name: 'Info', type: TYPES.NVarChar, value: Info}
			],
			callback
		);
	},

	uspVehicleSelect: function (Id,  callback) {
		invoker.invoke(
			'usp_Vehicle_Select',
			[
				{name: 'Id', type: TYPES.Int, value: Id}
			],
			callback
		);
	},

	uspVehicleTakeFromDriver: function (managerId, driverId,  callback) {
		invoker.invoke(
			'usp_Vehicle_TakeFromDriver',
			[
				{name: 'managerId', type: TYPES.Int, value: managerId},
				{name: 'driverId', type: TYPES.Int, value: driverId}
			],
			callback
		);
	},

	uspVehicleUpdate: function (Id, ManagerId, Name, Info,  callback) {
		invoker.invoke(
			'usp_Vehicle_Update',
			[
				{name: 'Id', type: TYPES.Int, value: Id},
				{name: 'ManagerId', type: TYPES.Int, value: ManagerId},
				{name: 'Name', type: TYPES.NVarChar, value: Name},
				{name: 'Info', type: TYPES.NVarChar, value: Info}
			],
			callback
		);
	}
};
