USE [VehicleTrackerDB]
GO

CREATE PROCEDURE SetConfig(@configName varchar(50), @configValue nvarchar(255))
AS
BEGIN
	INSERT INTO Configuration
	VALUES (@configName, @configValue)
END
GO


CREATE FUNCTION GetConfig(@configName varchar(50))
    RETURNS nvarchar(255)
AS
BEGIN
return 
    (SELECT Value FROM Configuration
	WHERE Name = @configName)
END
GO

--exec dbo.SetConfig 'baby', 'dont hurt me'
--print dbo.GetConfig('what')
GO