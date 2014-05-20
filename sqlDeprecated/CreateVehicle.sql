USE [VehicleTrackerDB] 

go 

IF OBJECT_ID('CreateVehicle') IS NOT NULL 
  BEGIN 
      DROP PROCEDURE createvehicle 
  END 

go 

CREATE PROCEDURE CreateVehicle(@managerId    UNIQUEIDENTIFIER, 
                               @driverId     UNIQUEIDENTIFIER, 
                               @licensePlage NVARCHAR(10), 
                               @longitude    NVARCHAR(20), 
                               @latitude     NVARCHAR(20), 
                               @SRID         INT = 4326) 
AS 
  BEGIN 
      DECLARE @vehicleId UNIQUEIDENTIFIER 

      SET @vehicleId = NEWID() 

      INSERT INTO [dbo].[Vehicle] 
                  ([Id], 
                   [LicensePlate], 
                   [ManagerId]) 
      VALUES      (@vehicleId, 
                   @licensePlage, 
                   @managerId) 

      DECLARE @vehiclePositionWKT NVARCHAR(50) 

      SET @vehiclePositionWKT = 'POINT(' + @longitude + ' ' + @latitude + ')' 

      DECLARE @vehiclePosition GEOGRAPHY 

      SET @vehiclePosition = geography::STGeomFromText(@vehiclePositionWKT, 
                             @SRID) 

      INSERT INTO [dbo].[VehiclePosition] 
                  ([Position], 
                   [VehicleId], 
                   [Date]) 
      VALUES      (@vehiclePosition, 
                   @vehicleId, 
                   GETDATE()) 

      INSERT INTO [dbo].[DriverVehicle] 
                  ([DriverId], 
                   [VehicleId]) 
      VALUES      (@driverId, 
                   @vehicleId) 
  END 

go 