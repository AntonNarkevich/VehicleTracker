CREATE PROCEDURE GetVehicle(@driverId UNIQUEIDENTIFIER) 
AS 
  BEGIN 
      SELECT Vehicle.Id, 
             Vehicle.LicensePlate 
      FROM   DriverVehicle 
             INNER JOIN Vehicle 
                     ON DriverVehicle.VehicleId = Vehicle.Id 
      WHERE  ( DriverVehicle.DriverId = @driverId ) 
  END 