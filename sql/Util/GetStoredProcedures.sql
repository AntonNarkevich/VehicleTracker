USE vehicletrackerdb 

GO 

if object_id('usp_UTIL_GetStoredProcedures') is not null
begin
	drop procedure usp_UTIL_GetStoredProcedures
end
GO

create procedure usp_UTIL_GetStoredProcedures
as
SELECT SO.name                   AS ProcedureName, 
       P.parameter_id            AS [ParameterID], 
       P.name                    AS [ParameterName], 
       TYPE_NAME(P.user_type_id) AS [ParameterType] 

FROM   sys.objects AS SO 
       INNER JOIN sys.parameters AS P 
               ON SO.OBJECT_ID = P.OBJECT_ID 
WHERE  SO.OBJECT_ID IN (SELECT OBJECT_ID 
                        FROM   sys.objects 
                        WHERE  TYPE = 'P') 
ORDER  BY SO.name, 
          P.parameter_id 

GO 