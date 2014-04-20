USE [VehicleTrackerDB]
GO

INSERT INTO [dbo].[Vehicle]
           ([Id]
           ,[LicensePlate]
           ,[UserId])
     VALUES
           (NEWID()
           ,'777'
           ,'07bd2acd-08ed-441d-895f-e6c2b6584372')
GO


