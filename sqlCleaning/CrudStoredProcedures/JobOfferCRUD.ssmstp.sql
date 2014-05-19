USE [VehicleTrackerDBCleaning];
GO

IF OBJECT_ID('[dbo].[usp_JobOffer_Select]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_JobOffer_Select] 
END 
GO
CREATE PROC [dbo].[usp_JobOffer_Select] 
    @SenderId INT,
    @RecieverId INT
AS 
	SET NOCOUNT ON 
	SET XACT_ABORT ON  

	BEGIN TRAN

	SELECT [SenderId], [RecieverId], [OfferStatus], [OfferDate], [DecisionDate] 
	FROM   [dbo].[JobOffers] 
	WHERE  ([SenderId] = @SenderId OR @SenderId IS NULL) 
	       AND ([RecieverId] = @RecieverId OR @RecieverId IS NULL) 

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
	SELECT [SenderId], [RecieverId], [OfferStatus], [OfferDate], [DecisionDate]
	FROM   [dbo].[JobOffers]
	WHERE  [SenderId] = @SenderId
	       AND [RecieverId] = @RecieverId
	-- End Return Select <- do not remove
               
	COMMIT
GO
IF OBJECT_ID('[dbo].[usp_JobOffer_Update]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_JobOffer_Update] 
END 
GO
CREATE PROC [dbo].[usp_JobOffer_Update] 
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
	WHERE  [SenderId] = @SenderId
	       AND [RecieverId] = @RecieverId
	
	-- Begin Return Select <- do not remove
	SELECT [SenderId], [RecieverId], [OfferStatus], [OfferDate], [DecisionDate]
	FROM   [dbo].[JobOffers]
	WHERE  [SenderId] = @SenderId
	       AND [RecieverId] = @RecieverId	
	-- End Return Select <- do not remove

	COMMIT
GO
IF OBJECT_ID('[dbo].[usp_JobOffer_Delete]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_JobOffer_Delete] 
END 
GO
CREATE PROC [dbo].[usp_JobOffer_Delete] 
    @SenderId int,
    @RecieverId int
AS 
	SET NOCOUNT ON 
	SET XACT_ABORT ON  
	
	BEGIN TRAN

	DELETE
	FROM   [dbo].[JobOffers]
	WHERE  [SenderId] = @SenderId
	       AND [RecieverId] = @RecieverId

	COMMIT
GO

----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------

