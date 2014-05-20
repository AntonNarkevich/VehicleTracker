USE VehicleTrackerDBCleaning
GO

:setvar path "D:\Projects\VehicleTracker\sqlCleaning\FakeData"

:r $(path)\Users.datanamic.sql
:r $(path)\UsersXRoles.datanamic.sql
:r $(path)\Messages.datanamic.sql
:r $(path)\JobOffers.datanamic.sql
:r $(path)\ManagerXDrivers.datanamic.sql
:r $(path)\Vehicles.datanamic.sql
:r $(path)\DriverXVehicle.datanamic.sql
:r $(path)\Positions.datanamic.sql

GO