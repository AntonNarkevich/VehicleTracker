USE [VehicleTrackerDB] 

go 

CREATE PROCEDURE Employ(@managerId UNIQUEIDENTIFIER, 
                        @driverId  UNIQUEIDENTIFIER) 
AS 
  BEGIN 
      INSERT INTO [dbo].[ManagerDriver] 
                  ([ManagerId], 
                   [DriverId], 
                   [EmploymentStatus]) 
      VALUES      (@managerId, 
                   @driverId, 
                   'employed') 
  END 

go 