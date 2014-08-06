USE VehicleTrackerDb
GO

:setvar path "D:\Projects\VehicleTracker\sql\UnitTests"

:r $(path)\UserCrud.sql
:r $(path)\Membership.sql
--:r $(path)\InitCorrectness.sql
GO

exec tsu_runTests
go

exec tsu_showTestResults
go