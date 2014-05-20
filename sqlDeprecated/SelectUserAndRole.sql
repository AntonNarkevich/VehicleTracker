USE [VehicleTrackerDB]
GO

--SELECT CASE WHEN (count(*) = 1)
--  then 'more'
--  else 'less'
--  end
--  FROM [dbo].[User]
--GO


--if exists (select * from  [dbo].[User] where Email = 'what@is.love' ) 
--select 'True'  
--else 
--select 'False' 

--go

(SELECT * 
FROM   [User] AS u 
       JOIN UserRole AS ur 
         ON u.Id = ur.UresId 
       JOIN Role AS r 
         ON ur.RoleId = r.Id 
WHERE  r.Name = 'admin')
