----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

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
	select Id as VehicleId,	ManagerId, Name, Info
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
	@managerId int,
    @vehicleId INT,
	@driverId INT
	--TODO: Inconsitency can occure. A vehicle may be assgned to driver that is not employed.
AS
	begin transaction

	declare @EmploymentInfo table (ManagerId int, DriverId int, IsBoss bit)
	insert into @EmploymentInfo
	exec usp_BL_Manager_IsBossFor @managerId, @driverId

	declare @isBoss bit
	select @isBoss = IsBoss
	from @EmploymentInfo

	
	declare @ownershipInfo table(ManagerId int, DriverId int, IsOwner bit)
	insert into @ownershipInfo
	exec usp_BL_Manager_IsVehicleOwner @managerId, @vehicleId

	declare @isVehicleOwner bit
	select @isVehicleOwner = IsOwner
	from @ownershipInfo


	if (@isBoss = 1 and @isVehicleOwner = 1)
	begin
		insert into DriverXVehicle (DriverId, VehicleId)
		values (@driverId, @vehicleId)	
	end
	else begin
		--TODO: Remove this. Throw proper error.
		RAISERROR (15600,-1,-1, 'Inconsitency. Manager manipulates a vehicle he doesnt own. Or driver he is not a boss for.');
	end

	commit
GO

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_Vehicle_TakeFromDriver]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_Vehicle_TakeFromDriver]
END
GO

use [VehicleTrackerDb]
go

--Only one vehicle can be assigned to a driver. So VehicleId parameter is not required.
CREATE PROC [dbo].[usp_Vehicle_TakeFromDriver]
	@managerId int,
    @driverId INT
AS
	begin transaction

	declare @EmploymentInfo table (ManagerId int, DriverId int, IsBoss bit)
	insert into @EmploymentInfo
	exec usp_BL_Manager_IsBossFor @managerId, @driverId

	declare @isBoss bit
	select @isBoss = IsBoss
	from @EmploymentInfo

	if (@isBoss = 1)
	begin
		delete from DriverXVehicle
		where DriverId = @driverId
	end
	else begin
		--TODO: Remove this. Throw proper error.
		RAISERROR (15600,-1,-1, 'Inconsitency. Manager manipulates a driver he is not a boss for.');
	end

	commit
GO

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_Vehicle_GetVehicleAssignmentInfo]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_Vehicle_GetVehicleAssignmentInfo]
END
GO

use [VehicleTrackerDb]
go

CREATE PROC [dbo].[usp_Vehicle_GetVehicleAssignmentInfo]
    @managerId INT
AS
	select Id, Name,
		case when exists(select *
					from DriverXVehicle
					where exists(select * from DriverXVehicle
							where DriverXVehicle.VehicleId = Vehicles.Id))
		then cast('TRUE' as bit) else cast('FALSE' as bit) end as IsAssigned
	from Vehicles
GO

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_Vehicle_GetVehicleFullInfo]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_Vehicle_GetVehicleFullInfo]
END
GO

use [VehicleTrackerDb]
go

CREATE PROC [dbo].[usp_Vehicle_GetVehicleFullInfo]
    @vehicleId INT
AS
	select Vehicles.Id 'VehicleId', Vehicles.Name, Info, Users.Id 'DriverId' , Email 'DriverEmail'
	from Vehicles left join DriverXVehicle
		on Vehicles.Id = DriverXVehicle.VehicleId
		left join Users
		on DriverXVehicle.DriverId = Users.Id
	where Vehicles.Id = @vehicleId
GO

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_Vehicle_GetPositions]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_Vehicle_GetPositions]
END
GO

use [VehicleTrackerDb]
go

CREATE PROC [dbo].[usp_Vehicle_GetPositions]
	@vehicleId int
AS
	select VehicleId, Position.Long as 'Longitude', Position.Lat 'Latitude'
	from Positions
	where VehicleId = @vehicleId
	order by CheckoutDate
GO

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_Vehicle_SetPositions]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_Vehicle_SetPositions]
END
GO

use [VehicleTrackerDb]
go

CREATE PROC [dbo].[usp_Vehicle_SetPositions]
								    @vehicleId int, 
                                    @longitude NVARCHAR(20), 
                                    @latitude  NVARCHAR(20)
AS
	  declare @SRID      INT = 4326 
      DECLARE @vehiclePositionWKT NVARCHAR(50) 

      SET @vehiclePositionWKT = 'POINT(' + @longitude + ' ' + @latitude + ')' 

      DECLARE @vehiclePosition GEOGRAPHY 

      SET @vehiclePosition = geography::STGeomFromText(@vehiclePositionWKT, 
                             @SRID) 

      INSERT INTO [dbo].[Positions] 
                  ([Position], 
                   [VehicleId], 
                   [CheckoutDate]) 
      VALUES      (@vehiclePosition, 
                   @vehicleId, 
                   GETDATE()) 
GO

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------


IF OBJECT_ID('[dbo].[usp_Vehicle_Create]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_Vehicle_Create]
END
GO

use [VehicleTrackerDb]
go

CREATE PROC [dbo].[usp_Vehicle_Create]
							   @managerId    int, 
                               @driverId     int, 
                               @name NVARCHAR(30), 
							   @info nvarchar(600),
                               @longitude    NVARCHAR(20), 
                               @latitude     NVARCHAR(20)
AS
	exec usp_Vehicle_Insert @managerId, @name, @info
	declare @vehicleId int = @@IDENTITY

	exec usp_Vehicle_SetPositions @vehicleId, @longitude, @latitude

	if @driverId is not null
	begin
		exec usp_Vehicle_AssignToDriver @managerId, @vehicleId, @driverId
	end
GO
