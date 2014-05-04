USE vehicletrackerdb 

go 

IF OBJECT_ID('GetVehiclePositions') IS NOT NULL 
  BEGIN 
      DROP PROCEDURE getvehiclepositions 
  END 

go 

CREATE PROCEDURE GetVehiclePositions(@vehicleId UNIQUEIDENTIFIER) 
AS 
  BEGIN 
      SELECT Id, 
             Position.Long as Longitude,
             Position.Lat as Latitude,
			 [Date] 
      FROM   VehiclePosition 
      WHERE  VehicleId = @vehicleId 
      ORDER  BY [Date] ASC 
  END 