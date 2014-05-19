USE [VehicleTrackerDBCleaning];
GO

IF OBJECT_ID('[dbo].[usp_Vehicle_Select]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_Vehicle_Select] 
END 
GO
CREATE PROC [dbo].[usp_Vehicle_Select] 
    @Id INT
AS 
	SET NOCOUNT ON 
	SET XACT_ABORT ON  

	BEGIN TRAN

	SELECT [Id], [ManagerId], [Name], [Info] 
	FROM   [dbo].[Vehicles] 
	WHERE  ([Id] = @Id OR @Id IS NULL) 

	COMMIT
GO
IF OBJECT_ID('[dbo].[usp_Vehicle_Insert]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_Vehicle_Insert] 
END 
GO
CREATE PROC [dbo].[usp_Vehicle_Insert] 
    @ManagerId int,
    @Name nvarchar(30),
    @Info nvarchar(600)
AS 
	SET NOCOUNT ON 
	SET XACT_ABORT ON  
	
	BEGIN TRAN
	
	INSERT INTO [dbo].[Vehicles] ([ManagerId], [Name], [Info])
	SELECT @ManagerId, @Name, @Info
	
	-- Begin Return Select <- do not remove
	SELECT [Id], [ManagerId], [Name], [Info]
	FROM   [dbo].[Vehicles]
	WHERE  [Id] = SCOPE_IDENTITY()
	-- End Return Select <- do not remove
               
	COMMIT
GO
IF OBJECT_ID('[dbo].[usp_Vehicle_Update]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_Vehicle_Update] 
END 
GO
CREATE PROC [dbo].[usp_Vehicle_Update] 
    @Id int,
    @ManagerId int,
    @Name nvarchar(30),
    @Info nvarchar(600)
AS 
	SET NOCOUNT ON 
	SET XACT_ABORT ON  
	
	BEGIN TRAN

	UPDATE [dbo].[Vehicles]
	SET    [ManagerId] = @ManagerId, [Name] = @Name, [Info] = @Info
	WHERE  [Id] = @Id
	
	-- Begin Return Select <- do not remove
	SELECT [Id], [ManagerId], [Name], [Info]
	FROM   [dbo].[Vehicles]
	WHERE  [Id] = @Id	
	-- End Return Select <- do not remove

	COMMIT
GO
IF OBJECT_ID('[dbo].[usp_Vehicle_Delete]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_Vehicle_Delete] 
END 
GO
CREATE PROC [dbo].[usp_Vehicle_Delete] 
    @Id int
AS 
	SET NOCOUNT ON 
	SET XACT_ABORT ON  
	
	BEGIN TRAN

	DELETE
	FROM   [dbo].[Vehicles]
	WHERE  [Id] = @Id

	COMMIT
GO

----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------

