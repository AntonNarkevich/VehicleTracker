USE [VehicleTrackerDb];
GO

IF OBJECT_ID('[dbo].[usp_User_Select]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_User_Select]
END
GO
CREATE PROC [dbo].[usp_User_Select]
    @Id INT
AS
	SET NOCOUNT ON
	SET XACT_ABORT ON

	BEGIN TRAN

	SELECT [Id], [Name], [Email], [PasswordHash], [IsBlocked]
	FROM   [dbo].[Users]
	WHERE  ([Id] = @Id OR @Id IS NULL)

	COMMIT
GO
IF OBJECT_ID('[dbo].[usp_User_Insert]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_User_Insert]
END
GO
CREATE PROC [dbo].[usp_User_Insert]
    @Name nvarchar(20),
    @Email varchar(320),
    @PasswordHash varchar(60),
    @IsBlocked bit
AS
	SET NOCOUNT ON
	SET XACT_ABORT ON

	BEGIN TRAN

	INSERT INTO [dbo].[Users] ([Name], [Email], [PasswordHash], [IsBlocked])
	SELECT @Name, @Email, @PasswordHash, @IsBlocked

	-- Begin Return Select <- do not remove
	SELECT [Id], [Name], [Email], [PasswordHash], [IsBlocked]
	FROM   [dbo].[Users]
	WHERE  [Id] = SCOPE_IDENTITY()
	-- End Return Select <- do not remove

	COMMIT
GO
IF OBJECT_ID('[dbo].[usp_User_Update]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_User_Update]
END
GO
CREATE PROC [dbo].[usp_User_Update]
    @Id int,
    @Name nvarchar(20),
    @Email varchar(320),
    @PasswordHash varchar(60),
    @IsBlocked bit
AS
	SET NOCOUNT ON
	SET XACT_ABORT ON

	BEGIN TRAN

	UPDATE [dbo].[Users]
	SET    [Name] = @Name, [Email] = @Email, [PasswordHash] = @PasswordHash, [IsBlocked] = @IsBlocked
	WHERE  [Id] = @Id

	-- Begin Return Select <- do not remove
	SELECT [Id], [Name], [Email], [PasswordHash], [IsBlocked]
	FROM   [dbo].[Users]
	WHERE  [Id] = @Id
	-- End Return Select <- do not remove

	COMMIT
GO
IF OBJECT_ID('[dbo].[usp_User_Delete]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_User_Delete]
END
GO
CREATE PROC [dbo].[usp_User_Delete]
    @Id int
AS
	SET NOCOUNT ON
	SET XACT_ABORT ON

	BEGIN TRAN

	DELETE
	FROM   [dbo].[Users]
	WHERE  [Id] = @Id

	COMMIT
GO

----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------

