USE [VehicleTrackerDB]
GO

INSERT INTO [dbo].[User]
           ([Id]
           ,[Email]
           ,[PasswordCache]
           ,[DisplayName])
     VALUES
           (NEWID()
           ,'what@is.love'
           ,'PasswordCache'
           ,'DisplayName')
GO


