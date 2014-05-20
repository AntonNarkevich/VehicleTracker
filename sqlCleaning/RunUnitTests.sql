USE VehicleTrackerDBCleaning
GO

:setvar path "D:\Projects\VehicleTracker\sqlCleaning\UnitTests"

:r $(path)\UserCrud.sql
:r $(path)\Membership.sql
GO

exec tsu_runTests
go

exec tsu_showTestResults
go