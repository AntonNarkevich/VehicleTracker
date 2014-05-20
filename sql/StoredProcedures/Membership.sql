--Special stored procedures to manipulate membership model
-------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_MBSP_User_GetByEmail]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_MBSP_User_GetByEmail] 
END 
GO
CREATE PROC [dbo].[usp_MBSP_User_GetByEmail]
    @Email VARCHAR(320)
AS 
	SET NOCOUNT ON 
	SET XACT_ABORT ON  

	BEGIN TRAN

	SELECT *
	FROM   [dbo].[Users] 
	WHERE  ([Email] = @Email) 

	COMMIT
GO

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_MBSP_User_GetRolesById]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_MBSP_User_GetRolesById] 
END 
GO

CREATE PROC [dbo].[usp_MBSP_User_GetRolesById] 
	@Id INT
AS
SELECT RoleName
  FROM VW_UserRoles
  WHERE
	UserId = @Id
GO

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_MBSP_Role_GetIdByName]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_MBSP_Role_GetIdByName] 
END 
GO
CREATE PROC [dbo].[usp_MBSP_Role_GetIdByName]
    @roleName VARCHAR(20)
AS 
	DECLARE @roleId INT

	SELECT @roleId = Id
	FROM Roles
	WHERE Name = @roleName

	RETURN @roleId
GO

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_MBSP_User_AddRole]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_MBSP_User_AddRole] 
END 
GO

CREATE PROC [dbo].[usp_MBSP_User_AddRole] 
	@userId INT,
	@roleName VARCHAR(20)
AS

BEGIN TRAN

	DECLARE @roleId INT

	EXEC @roleId = usp_MBSP_Role_GetIdByName @roleName

	INSERT INTO UsersXRoles (UserId, RoleId)
	VALUES (@userId, @roleId)

COMMIT

GO

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_MBSP_User_RemoveRole]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_MBSP_User_RemoveRole] 
END 
GO

CREATE PROC [dbo].[usp_MBSP_User_RemoveRole] 
	@userId INT,
	@roleName VARCHAR(20)
AS

BEGIN TRAN

	DECLARE @roleId INT

	EXEC @roleId = usp_MBSP_Role_GetIdByName @roleName

	DELETE FROM UsersXRoles
	WHERE UserId = @userId AND RoleId = @roleId

COMMIT

GO