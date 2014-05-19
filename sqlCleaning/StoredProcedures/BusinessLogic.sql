USE VehicleTrackerDBCleaning
GO

--Rejects all pending job offers for the driver.
--Sets DecisionDate equal to current date and time.
IF OBJECT_ID('[dbo].[usp_BL_Driver_RejectPendingJobOffers]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_BL_Driver_RejectPendingJobOffers] 
END 
GO
CREATE PROC [dbo].[usp_BL_Driver_RejectPendingJobOffers] 
    @driverId INT
AS 
	UPDATE [dbo].[JobOffers]
	SET    [OfferStatus] = 'Rejected',
			[DecisionDate] = GETDATE()
	WHERE  ([SenderId] = @driverId
	       OR [RecieverId] = @driverId)
		   AND [OfferStatus] = 'Pending'
GO

-------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------

IF OBJECT_ID('[dbo].[usp_BL_Manager_GetDriverIds]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_BL_Manager_GetDriverIds] 
END 
GO

CREATE PROC [dbo].[usp_BL_Manager_GetDriverIds] 
	@managerId INT
AS

SELECT DriverId
FROM VW_ManagerDrivers
WHERE ManagerId = @managerId

GO

-------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------

--Accepts job offer between manager and driver
--Rejects all offers between the driver and all other managers
--Adds the driver to the manager employee list
IF OBJECT_ID('[dbo].[usp_BL_Manager_EmployDriver]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_BL_Manager_EmployDriver] 
END 
GO

CREATE PROC [dbo].[usp_BL_Manager_EmployDriver] 
	@managerId INT,
	@driverId INT
AS

BEGIN TRAN

EXEC usp_JobOffer_Accept @managerId, @driverId
EXEC usp_JobOffer_Accept @driverId, @managerId

EXEC usp_BL_Driver_RejectPendingJobOffers @driverId

INSERT INTO ManagerXDrivers (ManagerId, DriverId)
VALUES (@managerId, @driverId)

COMMIT

GO


--TODO: "Fire" stored procedure. That in addition removes all vehicles.

-------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------

--Checks whether the manager is employer for the driver
IF OBJECT_ID('[dbo].[usp_BL_Manager_IsEmployerFor]') IS NOT NULL
BEGIN 
    DROP PROC [dbo].[usp_BL_Manager_IsEmployerFor] 
END 
GO

CREATE PROC [dbo].[usp_BL_Manager_IsEmployerFor] 
	@managerId INT,
	@driverId INT
AS

	BEGIN TRAN

	DECLARE @EmployedDrivers TABLE (
		DriverId INT
	)

	INSERT INTO @EmployedDrivers EXEC usp_BL_Manager_GetDriverIds @managerId

	IF (EXISTS (SELECT * FROM @EmployedDrivers
	WHERE DriverId = @driverId))
	BEGIN
		SELECT @managerId ManagerId, @driverId DriverId, 'TRUE' IsEmployer
	END
	ELSE
	BEGIN
		SELECT @managerId ManagerId, @driverId DriverId, 'FALSE' IsEmployer
	END

	COMMIT

GO