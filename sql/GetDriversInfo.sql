USE [VehicleTrackerDB] 

go 

CREATE PROCEDURE GetDriversInfo(@managerId UNIQUEIDENTIFIER) 
AS 
  BEGIN 
      SELECT Email, 
             Id, 
             EmploymentStatus 
      FROM   ManagerDriver 
             JOIN [User] 
               ON ManagerDriver.DriverId = [User].Id 
      WHERE  ( ManagerDriver.ManagerId = @managerId ) 
  END 

go 