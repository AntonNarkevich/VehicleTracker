USE VehicleTrackerDb 

GO 

IF Object_id('usp_Util_GetStoredProcedures') IS NOT NULL 
  BEGIN 
      DROP PROCEDURE usp_Util_GetStoredProcedures 
  END 

GO 

CREATE PROCEDURE usp_Util_GetStoredProcedures 
AS 
    SELECT SO.name                   AS ProcedureName, 
           P.parameter_id            AS [ParameterID], 
           P.name                    AS [ParameterName], 
           Type_name(P.user_type_id) AS [ParameterType] 
    FROM   sys.objects AS SO 
           LEFT JOIN sys.parameters AS P 
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

IF Object_id('usp_Util_DeleteAllData') IS NOT NULL 
  BEGIN 
      DROP PROCEDURE usp_Util_DeleteAllData 
  END 

GO 

CREATE PROCEDURE usp_Util_DeleteAllData 
AS 
    DELETE FROM [DriverXVehicle] 

    DELETE FROM [Positions] 

    DELETE FROM [Vehicles] 

    DELETE FROM [ManagerXDrivers] 

    DELETE FROM [Messages] 

    DELETE FROM [JobOffers] 

    DELETE FROM [UsersXRoles] 

    DELETE FROM [Users] 

GO 