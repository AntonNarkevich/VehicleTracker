USE [VehicleTrackerDB] 

go 

CREATE PROCEDURE GetUnemployedDrivers 
AS 
  BEGIN 
      SELECT Email, 
             [User].Id, 
             [Role].Name 
      FROM   [User] 
             INNER JOIN UserRole 
                     ON [User].Id = UserRole.UresId 
             INNER JOIN [Role] 
                     ON UserRole.RoleId = [Role].Id 
      WHERE  [Role].Name = 'driver' 
             AND NOT EXISTS(SELECT * 
                            FROM   ManagerDriver 
                            WHERE  ManagerDriver.DriverId = [User].Id 
                                   AND EmploymentStatus = 'employed') 
  END 

go 