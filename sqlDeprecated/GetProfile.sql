USE [VehicleTrackerDB]
GO

/****** Object:  StoredProcedure [dbo].[GetProfile]    Script Date: 01.05.2014 18:28:25 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[GetProfile](@userId UNIQUEIDENTIFIER) 
AS 
  BEGIN 
      SELECT [Id], 
             [Email], 
             [Name] AS [Role] 
      FROM   [dbo].[UserRolesView] 
      WHERE  [Id] = @userId 
  END 


GO


