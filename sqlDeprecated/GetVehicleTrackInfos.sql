USE vehicletrackerdb 

go 

IF OBJECT_ID('GetVehicleTrackInfos') IS NOT NULL 
  BEGIN 
      DROP PROCEDURE getvehicletrackinfos 
  END 

go 

CREATE PROCEDURE GetVehicleTrackInfos(@managerId UNIQUEIDENTIFIER) 
AS 
  BEGIN 
      SELECT Vehicle.Id, 
             Vehicle.LicensePlate, 
             [Date], 
             Position.Long AS Longitude, 
             Position.Lat  AS Latitude
      FROM   Vehicle 
             JOIN VehiclePosition 
               ON Vehicle.Id = VehiclePosition.VehicleId 
      WHERE  Vehicle.ManagerId = @managerId 
  END 

go 