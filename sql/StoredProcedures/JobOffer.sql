USE [VehicleTrackerDb]; 

GO 

IF Object_id('[dbo].[usp_JobOffer_GetBySenderAndReceiver]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_JobOffer_GetBySenderAndReceiver] 
  END 

GO 

CREATE PROC [dbo].[Usp_joboffer_getbysenderandreceiver] @SenderId   INT, 
                                                        @RecieverId INT 
AS 
    SELECT * 
    FROM   [dbo].[JobOffers] 
    WHERE  ( [SenderId] = @SenderId ) 
           AND ( [RecieverId] = @RecieverId ) 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
IF Object_id('[dbo].[usp_JobOffer_MakeOffer]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_JobOffer_MakeOffer] 
  END 

GO 

CREATE PROC [dbo].[Usp_joboffer_makeoffer] @senderId   INT, 
                                           @recieverId INT 
AS 
    DECLARE @offerDate DATETIME = GETDATE() 

    EXEC [dbo].[Usp_joboffer_insert] 
      @senderId, 
      @recieverId, 
      'Pending', 
      @offerDate, 
      NULL 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
IF Object_id('[dbo].[usp_JobOffer_GetBySenderId]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_JobOffer_GetBySenderId] 
  END 

GO 

CREATE PROC [dbo].[Usp_joboffer_getbysenderid] @senderId INT 
AS 
    SELECT * 
    FROM   JobOffers 
    WHERE  SenderId = @senderId 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
IF Object_id('[dbo].[usp_JobOffer_GetByRecieverId]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_JobOffer_GetByRecieverId] 
  END 

GO 

CREATE PROC [dbo].[Usp_joboffer_getbyrecieverid] @recieverId INT 
AS 
    SELECT * 
    FROM   JobOffers 
    WHERE  RecieverId = @recieverId 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
IF Object_id('[dbo].[usp_JobOffer_Accept]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_JobOffer_Accept] 
  END 

GO 

CREATE PROC [dbo].[Usp_joboffer_accept] @SenderId   INT, 
                                        @RecieverId INT 
AS 
    UPDATE [dbo].[JobOffers] 
    SET    [OfferStatus] = 'Accepted', 
           [DecisionDate] = GETDATE() 
    WHERE  [SenderId] = @SenderId 
           AND [RecieverId] = @RecieverId 
           AND [OfferStatus] = 'Pending' 

GO 

------------------------------------------------------------------------------- 
------------------------------------------------------------------------------- 
IF Object_id('[dbo].[usp_JobOffer_Reject]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_JobOffer_Reject] 
  END 

GO 

CREATE PROC [dbo].[Usp_joboffer_reject] @SenderId   INT, 
                                        @RecieverId INT 
AS 
    UPDATE [dbo].[JobOffers] 
    SET    [OfferStatus] = 'Rejected', 
           [DecisionDate] = GETDATE() 
    WHERE  [SenderId] = @SenderId 
           AND [RecieverId] = @RecieverId 
           AND [OfferStatus] = 'Pending' 

GO 