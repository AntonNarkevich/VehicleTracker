IF OBJECT_ID('[dbo].[usp_JobOffer_GetBySenderId]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_JobOffer_GetBySenderId] 
END 
GO
CREATE PROC [dbo].[usp_JobOffer_GetBySenderId] 
    @senderId INT
AS 
	select * 
	from JobOffers
	where SenderId = @senderId
GO

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_JobOffer_GetByRecieverId]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_JobOffer_GetByRecieverId] 
END 
GO
CREATE PROC [dbo].[usp_JobOffer_GetByRecieverId] 
    @recieverId INT
AS 
	select * 
	from JobOffers
	where RecieverId = @recieverId
GO

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_JobOffer_Accept]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_JobOffer_Accept]
END 
GO
CREATE PROC [dbo].[usp_JobOffer_Accept]
    @SenderId INT,
    @RecieverId INT
AS 
	UPDATE [dbo].[JobOffers]
	SET    [OfferStatus] = 'Accepted',
			--TODO: Am I allowed to get current time this way?
		   [DecisionDate] = GETDATE()
	WHERE  [SenderId] = @SenderId
	       AND [RecieverId] = @RecieverId
GO

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_JobOffer_Reject]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_JobOffer_Reject]
END 
GO
CREATE PROC [dbo].[usp_JobOffer_Reject]
    @SenderId INT,
    @RecieverId INT
AS 
	UPDATE [dbo].[JobOffers]
	SET    [OfferStatus] = 'Rejected',
			--TODO: Am I allowed to get current time this way?
		   [DecisionDate] = GETDATE()
	WHERE  [SenderId] = @SenderId
	       AND [RecieverId] = @RecieverId
GO
