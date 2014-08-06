--Stored procedures to manipulate membership model 
------------------------------------------------------------------------------- 
IF OBJECT_ID('[dbo].[usp_MBSP_User_GetByEmail]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_MBSP_User_GetByEmail] 
  END 

GO 

CREATE PROC [dbo].[usp_MBSP_User_GetByEmail] @Email VARCHAR(320) 
AS 
    SELECT * 
    FROM   [dbo].[Users] 
    WHERE  ( [Email] = @Email ) 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
IF OBJECT_ID('[dbo].[usp_MBSP_User_GetRolesById]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_MBSP_User_GetRolesById] 
  END 

GO 

CREATE PROC [dbo].[usp_MBSP_User_GetRolesById] @Id INT 
AS 
    SELECT RoleName 
    FROM   VW_UserRoles 
    WHERE  UserId = @Id 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
IF OBJECT_ID('[dbo].[usp_MBSP_User_GetProfile]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_MBSP_User_GetProfile] 
  END 

GO 

CREATE PROC [dbo].[usp_MBSP_User_GetProfile] @Id INT 
AS 
    --Output scalar user properties 
    EXEC usp_User_Select 
      @Id 

    --Output roles  
    DECLARE @roles TABLE 
      ( 
         RoleName VARCHAR(20) 
      ) 

    INSERT INTO @roles 
    EXEC usp_MBSP_User_GetRolesById 
      @Id 

    SELECT * 
    FROM   @roles 

    --If manager 
    IF ( EXISTS (SELECT RoleName 
                 FROM   @roles 
                 WHERE  RoleName = 'manager') ) 
      BEGIN 
          --Outuput employee ids 
          EXEC [dbo].[usp_BL_Manager_GetEmployees] 
            @Id 

          EXEC [dbo].[usp_Vehicle_GetByManagerId] 
            @Id 
      END 

    --If driver 
    IF ( EXISTS (SELECT RoleName 
                 FROM   @roles 
                 WHERE  RoleName = 'driver') ) 
      BEGIN 
          --Outuput employee ids 
          EXEC [dbo].[usp_BL_Driver_GetBoss] 
            @Id 

          EXEC [dbo].[usp_Vehicle_GetByDriverId] 
            @Id 
      END 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
IF OBJECT_ID('[dbo].[usp_MBSP_Role_GetIdByName]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_MBSP_Role_GetIdByName] 
  END 

GO 

CREATE PROC [dbo].[usp_MBSP_Role_GetIdByName] @roleName VARCHAR(20) 
AS 
    DECLARE @roleId INT 

    SELECT @roleId = Id 
    FROM   Roles 
    WHERE  Name = @roleName 

    RETURN @roleId 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
IF OBJECT_ID('[dbo].[usp_MBSP_User_AddRole]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_MBSP_User_AddRole] 
  END 

GO 

CREATE PROC [dbo].[usp_MBSP_User_AddRole] @userId   INT, 
                                          @roleName VARCHAR(20) 
AS 
    DECLARE @roleId INT 

    EXEC @roleId = usp_MBSP_Role_GetIdByName 
      @roleName 

    INSERT INTO UsersXRoles 
                (UserId, 
                 RoleId) 
    VALUES      (@userId, 
                 @roleId) 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
IF OBJECT_ID('[dbo].[usp_MBSP_User_RemoveRole]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_MBSP_User_RemoveRole] 
  END 

GO 

CREATE PROC [dbo].[usp_MBSP_User_RemoveRole] @userId   INT, 
                                             @roleName VARCHAR(20) 
AS 
    DECLARE @roleId INT 

    EXEC @roleId = usp_MBSP_Role_GetIdByName 
      @roleName 

    DELETE FROM UsersXRoles 
    WHERE  UserId = @userId 
           AND RoleId = @roleId 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
USE VehicleTrackerDb 

GO 

IF OBJECT_ID('[dbo].[usp_MBSP_User_Register]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_MBSP_User_Register] 
  END 

GO 

CREATE PROC [dbo].[usp_MBSP_User_Register] @Email        VARCHAR(320), 
                                           @PasswordHash VARCHAR(60), 
                                           @Role         VARCHAR(20) 
AS 
    DECLARE @error_number   INT, 
            @error_severity INT, 
            @error_state    INT, 
            @id             INT 

  BEGIN TRY 
      EXEC [dbo].[usp_User_Insert] 
        NULL, 
        @Email, 
        @PasswordHash, 
        'FALSE' 

      SET @id = @@IDENTITY 
  END TRY 

  BEGIN CATCH 
      SELECT @error_number = ERROR_NUMBER(), 
             @error_severity = ERROR_SEVERITY(), 
             @error_state = ERROR_STATE() 

      -- check unique key violation (Email is duplicated)      
      IF @error_number = 2627 
        BEGIN 
            SELECT cast('FALSE' AS BIT)                  AS IsSuccess, 
                   'User with such email already exist.' AS [Message] 

            ROLLBACK 

            RETURN 
        END 
      -- other errors  
      ELSE 
        BEGIN 
            RAISERROR(@error_number, @error_severity, @error_state) 
        END 
  END CATCH 

    IF @Role IN ( 'manager', 'driver', 'admin' ) 
      BEGIN 
          EXEC usp_MBSP_User_AddRole 
            @id, 
            @Role 
      END 

    SELECT cast('TRUE' AS BIT)        AS IsSuccess, 
           'Successfully registered.' AS [Message] 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
USE VehicleTrackerDb 

GO 

IF OBJECT_ID('[dbo].[usp_MBSP_IsAdminRegistered]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_MBSP_IsAdminRegistered] 
  END 

GO 

CREATE PROC [dbo].[usp_MBSP_IsAdminRegistered] 
AS 
    SELECT CASE 
             WHEN EXISTS (SELECT * 
                          FROM   VW_UserRoles 
                          WHERE  RoleName = 'admin') THEN Cast('TRUE' AS BIT) 
             ELSE Cast('FALSE' AS BIT) 
           END AS 'IsAdminRegistered' 

GO 