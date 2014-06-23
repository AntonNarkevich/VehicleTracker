----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_Track_GetVehiclePaths]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_Track_GetVehiclePaths]
END
GO

use [VehicleTrackerDb]
go

CREATE PROC [dbo].[usp_Track_GetVehiclePaths]
    @managerId INT
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