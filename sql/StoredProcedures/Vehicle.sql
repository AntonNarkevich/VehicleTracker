----------------------------------------------------------------------------------------------   
----------------------------------------------------------------------------------------------   
IF OBJECT_ID('[dbo].[usp_Vehicle_GetByDriverId]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_Vehicle_GetByDriverId] 
  END 

GO 

USE [VehicleTrackerDb] 

GO 

CREATE PROC [dbo].[usp_Vehicle_GetByDriverId] @driverId INT 
AS 
    SELECT * 
    FROM   VW_DriverVehicle 
    WHERE  DriverId = @driverId 

GO 

----------------------------------------------------------------------------------------------   
----------------------------------------------------------------------------------------------   
IF OBJECT_ID('[dbo].[usp_Vehicle_GetByManagerId]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_Vehicle_GetByManagerId] 
  END 

GO 

USE [VehicleTrackerDb] 

GO 

CREATE PROC [dbo].[usp_Vehicle_GetByManagerId] @managerId INT 
AS 
    SELECT Id AS VehicleId, 
           ManagerId, 
           Name, 
           Info 
    FROM   Vehicles 
    WHERE  ManagerId = @managerId 

GO 

----------------------------------------------------------------------------------------------   
----------------------------------------------------------------------------------------------   
IF OBJECT_ID('[dbo].[usp_Vehicle_AssignToDriver]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_Vehicle_AssignToDriver] 
  END 

GO 

USE [VehicleTrackerDb] 

go 

CREATE PROC [dbo].[usp_Vehicle_AssignToDriver] @managerId INT, 
                                               @vehicleId INT, 
                                               @driverId  INT
AS 
    BEGIN TRANSACTION 

		DECLARE @EmploymentInfo TABLE 
		  ( 
			 ManagerId INT, 
			 DriverId  INT, 
			 IsBoss    BIT 
		  ) 

		INSERT INTO @EmploymentInfo 
		EXEC usp_BL_Manager_IsBossFor 
		  @managerId, 
		  @driverId 

		DECLARE @isBoss BIT 

		SELECT @isBoss = IsBoss 
		FROM   @EmploymentInfo 

		DECLARE @ownershipInfo TABLE 
		  ( 
			 ManagerId INT, 
			 DriverId  INT, 
			 IsOwner   BIT 
		  ) 

		INSERT INTO @ownershipInfo 
		EXEC usp_BL_Manager_IsVehicleOwner 
		  @managerId, 
		  @vehicleId 

		DECLARE @isVehicleOwner BIT 

		SELECT @isVehicleOwner = IsOwner 
		FROM   @ownershipInfo 

		IF ( @isBoss = 1 
			 AND @isVehicleOwner = 1 ) 
		  BEGIN 
			  INSERT INTO DriverXVehicle 
						  (DriverId, 
						   VehicleId) 
			  VALUES      (@driverId, 
						   @vehicleId) 

			  SELECT cast('TRUE' AS BIT)        AS IsSuccess, 
					 'Successfully assigned.' AS [Message] 
		  END 
		ELSE 
		  BEGIN 
			  SELECT cast('FALSE' AS BIT) AS IsSuccess,
			  'Inconsitency. Manager manipulates a vehicle he doesnt own. Or a driver he is not a boss for.' AS [Message] 
		  END 

    COMMIT
GO 

----------------------------------------------------------------------------------------------   
----------------------------------------------------------------------------------------------   
IF OBJECT_ID('[dbo].[usp_Vehicle_TakeFromDriver]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_Vehicle_TakeFromDriver] 
  END 

GO 

USE [VehicleTrackerDb] 

go 

--Only one vehicle can be assigned to a driver. So VehicleId parameter is not required.   
CREATE PROC [dbo].[usp_Vehicle_TakeFromDriver] @managerId INT, 
                                               @driverId  INT 
AS 
    BEGIN TRANSACTION 

    DECLARE @EmploymentInfo TABLE 
      ( 
         ManagerId INT, 
         DriverId  INT, 
         IsBoss    BIT 
      ) 

    INSERT INTO @EmploymentInfo 
    EXEC usp_BL_Manager_IsBossFor 
      @managerId, 
      @driverId 

    DECLARE @isBoss BIT 

    SELECT @isBoss = IsBoss 
    FROM   @EmploymentInfo 

    IF ( @isBoss = 1 ) 
      BEGIN 
          DELETE FROM DriverXVehicle 
          WHERE  DriverId = @driverId 

		  SELECT cast('TRUE' AS BIT)        AS IsSuccess, 
		 'Successfully taken from.'         AS [Message]
      END 
    ELSE 
      BEGIN 
		  SELECT cast('FALSE' AS BIT) AS IsSuccess,
		  'Inconsitency. Manager manipulates a vehicle he doesnt own.' AS [Message] 
      END 

    COMMIT 

GO 

----------------------------------------------------------------------------------------------   
----------------------------------------------------------------------------------------------   
IF OBJECT_ID('[dbo].[usp_Vehicle_GetVehicleAssignmentInfo]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_Vehicle_GetVehicleAssignmentInfo] 
  END 

GO 

USE [VehicleTrackerDb] 

go 

CREATE PROC [dbo].[usp_Vehicle_GetVehicleAssignmentInfo] @managerId INT 
AS 
    SELECT Id as 'VehicleId', 
           Name, 
           CASE 
             WHEN EXISTS(SELECT * 
                         FROM   DriverXVehicle 
                         WHERE  EXISTS(SELECT * 
                                       FROM   DriverXVehicle 
                                       WHERE  DriverXVehicle.VehicleId = 
                                      Vehicles.Id)) THEN 
             cast('TRUE' AS BIT) 
             ELSE cast('FALSE' AS BIT) 
           END AS IsAssigned 
    FROM   Vehicles
	WHERE Vehicles.ManagerId = @managerId 

GO 

----------------------------------------------------------------------------------------------   
----------------------------------------------------------------------------------------------   
IF OBJECT_ID('[dbo].[usp_Vehicle_GetVehicleFullInfo]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_Vehicle_GetVehicleFullInfo] 
  END 

GO 

USE [VehicleTrackerDb] 

go 

CREATE PROC [dbo].[usp_Vehicle_GetVehicleFullInfo] @vehicleId INT 
AS 
    SELECT Vehicles.Id 'VehicleId', 
           Vehicles.Name, 
           Info, 
           Users.Id    'DriverId', 
           Email       'DriverEmail' 
    FROM   Vehicles 
           LEFT JOIN DriverXVehicle 
                  ON Vehicles.Id = DriverXVehicle.VehicleId 
           LEFT JOIN Users 
                  ON DriverXVehicle.DriverId = Users.Id 
    WHERE  Vehicles.Id = @vehicleId 

GO 

----------------------------------------------------------------------------------------------   
----------------------------------------------------------------------------------------------   
IF OBJECT_ID('[dbo].[usp_Vehicle_GetPositions]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_Vehicle_GetPositions] 
  END 

GO 

USE [VehicleTrackerDb] 

go 

CREATE PROC [dbo].[usp_Vehicle_GetPositions] @vehicleId INT 
AS 
    SELECT VehicleId, 
           Position.Long AS 'Longitude', 
           Position.Lat  'Latitude' 
    FROM   Positions 
    WHERE  VehicleId = @vehicleId 
    ORDER  BY CheckoutDate 

GO 

----------------------------------------------------------------------------------------------   
----------------------------------------------------------------------------------------------   
IF OBJECT_ID('[dbo].[usp_Vehicle_SetPositions]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_Vehicle_SetPositions] 
  END 

GO 

USE [VehicleTrackerDb] 

go 

CREATE PROC [dbo].[usp_Vehicle_SetPositions] @vehicleId INT, 
                                             @longitude NVARCHAR(20), 
                                             @latitude  NVARCHAR(20) 
AS 
    DECLARE @SRID INT = 4326 
    DECLARE @vehiclePositionWKT NVARCHAR(50) 

    SET @vehiclePositionWKT = 'POINT(' + @longitude + ' ' + @latitude + ')' 

    DECLARE @vehiclePosition GEOGRAPHY 

    SET @vehiclePosition = geography::STGeomFromText(@vehiclePositionWKT, @SRID) 

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

USE [VehicleTrackerDb] 

go 

CREATE PROC [dbo].[usp_Vehicle_Create] @managerId INT, 
                                       @driverId  INT, 
                                       @name      NVARCHAR(30), 
                                       @info      NVARCHAR(600), 
                                       @longitude NVARCHAR(20), 
                                       @latitude  NVARCHAR(20) 
AS 
    EXEC usp_Vehicle_Insert 
      @managerId, 
      @name, 
      @info 

    DECLARE @vehicleId INT = @@IDENTITY 

    EXEC usp_Vehicle_SetPositions 
      @vehicleId, 
      @longitude, 
      @latitude 

    IF @driverId IS NOT NULL 
      BEGIN 
          EXEC usp_Vehicle_AssignToDriver 
            @managerId, 
            @vehicleId, 
            @driverId 
      END 

GO 