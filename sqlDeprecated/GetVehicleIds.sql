USE VehicleTrackerDB 

go 

IF object_id('GetVehicleIds', 'P') IS NOT NULL 
  BEGIN 
      DROP PROCEDURE GetVehicleIds 
  END 

go 

CREATE PROCEDURE GetVehicleIds(@managerId UNIQUEIDENTIFIER) 
AS 
  BEGIN 
      SELECT Id 
      FROM   Vehicle 
      WHERE  ManagerId = @managerId 
  END 

go