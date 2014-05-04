USE vehicletrackerdb 

go 

IF OBJECT_ID('SetVehiclePosition', 'P') IS NOT NULL 
  BEGIN 
      DROP PROCEDURE setvehicleposition 
  END 

go 

CREATE PROCEDURE SetVehiclePosition(@vehicleId UNIQUEIDENTIFIER, 
                                    @longitude NVARCHAR(20), 
                                    @latitude  NVARCHAR(20), 
                                    @SRID      INT = 4326) 
AS 
  BEGIN 
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
  END 

go 