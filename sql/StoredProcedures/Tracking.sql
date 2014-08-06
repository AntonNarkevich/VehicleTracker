---------------------------------------------------------------------------------------------- 
---------------------------------------------------------------------------------------------- 
IF Object_id('[dbo].[usp_Track_GetVehiclePaths]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_Track_GetVehiclePaths] 
  END 

GO 

USE [VehicleTrackerDb] 

go 

CREATE PROC [dbo].[Usp_track_getvehiclepaths] @managerId INT 
AS 
    SELECT Vehicles.Id, 
           Vehicles.Name, 
           CheckoutDate, 
           Position.Long AS Longitude, 
           Position.Lat  AS Latitude 
    FROM   Vehicles 
           JOIN Positions 
             ON Vehicles.Id = Positions.VehicleId 
    WHERE  Vehicles.ManagerId = @managerId 

GO 

---------------------------------------------------------------------------------------------- 
---------------------------------------------------------------------------------------------- 
USE VehicleTrackerDB 

go 

IF Object_id('usp_Track_GetVehicleStatistics', 'P') IS NOT NULL 
  BEGIN 
      DROP PROCEDURE usp_Track_GetVehicleStatistics 
  END 

go 

CREATE PROCEDURE Usp_track_getvehiclestatistics(@VehicleId INT) 
AS 
  BEGIN 
      SELECT *, 
             Rank() 
               OVER ( 
                 ORDER BY Id) AS 'PositionNumber' 
      INTO   #numberedPositions 
      FROM   Positions 
      WHERE  VehicleId = @VehicleId 

      SELECT prevPosition.PositionNumber, 
             @VehicleId                                             AS 'VehicleId', 
             prevPosition.Position.Lat                              AS 'StartLatitude', 
             prevPosition.Position.Long                             AS 'StartLongitude', 
             curPosition.Position.Lat                               AS 'EndLatitude', 
             curPosition.Position.Long                              AS 'EndLongitude', 
             prevPosition.Position.STDistance(curPosition.Position) AS 'Distance', 
             CONVERT(VARCHAR(11), curPosition.CheckoutDate, 103)    AS 'EndDate' 
      FROM   #numberedPositions AS prevPosition 
             JOIN #numberedPositions AS curPosition 
               ON prevPosition.PositionNumber = curPosition.PositionNumber - 1 
  END 

go 

---------------------------------------------------------------------------------------------- 
---------------------------------------------------------------------------------------------- 
USE VehicleTrackerDB 

go 

IF Object_id('usp_Track_GetManagerVehiclesStatistics', 'P') IS NOT NULL 
  BEGIN 
      DROP PROCEDURE usp_Track_GetManagerVehiclesStatistics 
  END 

go 

CREATE PROCEDURE Usp_track_getmanagervehiclesstatistics(@ManagerId INT) 
AS 
  BEGIN 
      SELECT Id 
      INTO   #VehicleIds 
      FROM   Vehicles 
      WHERE  ManagerId = @ManagerId 

      -- declare a cursor to loop through the temp table 
      -- Declare the variables to store the values returned by FETCH. 
      DECLARE @vehicleId INT 
      DECLARE vehiclesCursor CURSOR FOR 
        SELECT * 
        FROM   #VehicleIds 

      OPEN vehiclesCursor 

      -- do first fetch and store the values in vars. 
      FETCH NEXT FROM vehiclesCursor INTO @vehicleId 

      -- check @@FETCH_STATUS see more rows to fetch. 
      WHILE @@FETCH_STATUS = 0 
        BEGIN 
            -- getting statistics for each vehicle.
            EXEC Usp_track_getvehiclestatistics 
              @vehicleId 

            -- get next 
            FETCH NEXT FROM vehiclesCursor INTO @vehicleId 
        END 

      CLOSE vehiclesCursor 

      DEALLOCATE vehiclesCursor 
  END 

GO 