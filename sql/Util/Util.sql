USE vehicletrackerdb 

GO 

if object_id('usp_Util_GetStoredProcedures') is not null
begin
	drop procedure usp_Util_GetStoredProcedures
end
GO

create procedure usp_Util_GetStoredProcedures
as
SELECT SO.name                   AS ProcedureName, 
       P.parameter_id            AS [ParameterID], 
       P.name                    AS [ParameterName], 
       TYPE_NAME(P.user_type_id) AS [ParameterType] 

FROM   sys.objects AS SO 
       left join sys.parameters AS P 
               ON SO.OBJECT_ID = P.OBJECT_ID 
WHERE  SO.OBJECT_ID IN (SELECT OBJECT_ID 
                        FROM   sys.objects 
                        WHERE  TYPE = 'P') 
ORDER  BY SO.name, 
          P.parameter_id 

GO 

-------------------------------------------------------------------------
-------------------------------------------------------------------------

USE vehicletrackerdb 

GO 

if object_id('usp_Util_DeleteAllData') is not null
begin
	drop procedure usp_Util_DeleteAllData
end
GO

create procedure usp_Util_DeleteAllData
as
	delete from [DriverXVehicle]
	delete from [Positions]
	delete from [Vehicles]
	delete from [ManagerXDrivers]
	delete from [Messages]
	delete from [JobOffers]
	delete from [UsersXRoles]
	delete from [Users]
GO 