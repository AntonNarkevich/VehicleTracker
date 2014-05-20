USE [VehicleTrackerDB]
GO

DELETE FROM [dbo].[Role]
GO

INSERT INTO [dbo].[Role] VALUES (1, 'admin')
INSERT INTO [dbo].[Role] VALUES (2, 'manager')
INSERT INTO [dbo].[Role] VALUES (3, 'driver')
GO


