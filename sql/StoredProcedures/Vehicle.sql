IF OBJECT_ID('[dbo].[usp_Vehicle_GetByDriverId]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_Vehicle_GetByDriverId]
END
GO

use [VehicleTrackerDb]
go

CREATE PROC [dbo].[usp_Vehicle_GetByDriverId]
    @driverId INT
AS
	select *
	from VW_DriverVehicle
	where DriverId = @driverId
GO

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_Vehicle_GetByManagerId]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_Vehicle_GetByManagerId]
END
GO

use [VehicleTrackerDb]
go

CREATE PROC [dbo].[usp_Vehicle_GetByManagerId]
    @managerId INT
AS
	select *
	from Vehicles
	where ManagerId = @managerId
GO

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_Vehicle_AssignToDriver]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_Vehicle_AssignToDriver]
END
GO

use [VehicleTrackerDb]
go

CREATE PROC [dbo].[usp_Vehicle_AssignToDriver]
    @vehicleId INT,
	@driverId INT
	--TODO: Inconsitency can occure. A vehicle may be assgned to driver that is not employed.
AS
	declare @managerId int

	select @managerId = ManagerId
	from Vehicles
	where Id = @vehicleId


	declare @EmployedDrivers table (
		DriverId int
	)

	insert into @EmployedDrivers exec usp_BL_GetDrivers_Manager

	IF (exists (select * from @EmployedDrivers
	where DriverId = @driverId))
	begin
		insert into DriverXVehicle (DriverId, VehicleId)
		values (@driverId, @vehicleId)
	end
	else
	begin
		--TODO: Remove this. Throw proper error.
		RAISERROR (15600,-1,-1, 'Inconsitency can occure. A vehicle may be assgned to driver that is not employed.');
	end


GO