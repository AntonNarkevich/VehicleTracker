USE [VehicleTrackerDb];
GO

IF OBJECT_ID('[dbo].[usp_JobOffer_Select]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_JobOffer_Select]
END
GO
CREATE PROC [dbo].[usp_JobOffer_Select]
    @Id INT
AS
	SET NOCOUNT ON
	SET XACT_ABORT ON

	BEGIN TRAN

	SELECT [Id], [SenderId], [RecieverId], [OfferStatus], [OfferDate], [DecisionDate]
	FROM   [dbo].[JobOffers]
	WHERE  ([Id] = @Id OR @Id IS NULL)

	COMMIT
GO
IF OBJECT_ID('[dbo].[usp_JobOffer_Insert]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_JobOffer_Insert]
END
GO
CREATE PROC [dbo].[usp_JobOffer_Insert]
    @SenderId int,
    @RecieverId int,
    @OfferStatus varchar(20),
    @OfferDate datetime,
    @DecisionDate datetime
AS
	SET NOCOUNT ON
	SET XACT_ABORT ON

	BEGIN TRAN

	INSERT INTO [dbo].[JobOffers] ([SenderId], [RecieverId], [OfferStatus], [OfferDate], [DecisionDate])
	SELECT @SenderId, @RecieverId, @OfferStatus, @OfferDate, @DecisionDate

	-- Begin Return Select <- do not remove
	SELECT [Id], [SenderId], [RecieverId], [OfferStatus], [OfferDate], [DecisionDate]
	FROM   [dbo].[JobOffers]
	WHERE  [Id] = SCOPE_IDENTITY()
	-- End Return Select <- do not remove

	COMMIT
GO
IF OBJECT_ID('[dbo].[usp_JobOffer_Update]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_JobOffer_Update]
END
GO
CREATE PROC [dbo].[usp_JobOffer_Update]
	@Id int,
    @SenderId int,
    @RecieverId int,
    @OfferStatus varchar(20),
    @OfferDate datetime,
    @DecisionDate datetime
AS
	SET NOCOUNT ON
	SET XACT_ABORT ON

	BEGIN TRAN

	UPDATE [dbo].[JobOffers]
	SET    [SenderId] = @SenderId, [RecieverId] = @RecieverId, [OfferStatus] = @OfferStatus, [OfferDate] = @OfferDate, [DecisionDate] = @DecisionDate
	WHERE  [Id] = @Id

	-- Begin Return Select <- do not remove
	SELECT [Id], [SenderId], [RecieverId], [OfferStatus], [OfferDate], [DecisionDate]
	FROM   [dbo].[JobOffers]
	WHERE  [Id] = @Id
	-- End Return Select <- do not remove

	COMMIT
GO
IF OBJECT_ID('[dbo].[usp_JobOffer_Delete]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_JobOffer_Delete]
END
GO
CREATE PROC [dbo].[usp_JobOffer_Delete]
	@Id int
AS
	SET NOCOUNT ON
	SET XACT_ABORT ON

	BEGIN TRAN

	DELETE
	FROM   [dbo].[JobOffers]
	WHERE  [Id] = @Id

	COMMIT
GO

----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------

