USE VehicleTrackerDb
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

-------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------

--Gets employees for particular manager
IF OBJECT_ID('[dbo].[usp_BL_Manager_GetEmployees]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_BL_Manager_GetEmployees]
END
GO

CREATE PROC [dbo].[usp_BL_Manager_GetEmployees]
	@managerId INT
AS
	SELECT DriverId, Email    
	FROM ManagerXDrivers INNER JOIN
	Users ON ManagerXDrivers.DriverId = Users.Id 
	WHERE ManagerId = @managerId
GO

-------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------


--TODO: "Fire" stored procedure. That in addition removes all vehicles.

-------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------

--Checks whether the manager is employer for the driver
IF OBJECT_ID('[dbo].[usp_BL_Manager_IsBossFor]') IS NOT NULL
BEGIN
    DROP PROC [dbo].[usp_BL_Manager_IsBossFor]
END
GO

CREATE PROC [dbo].[usp_BL_Manager_IsBossFor]
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
		SELECT @managerId ManagerId, @driverId DriverId, 'TRUE' IsBoss
	END
	ELSE
	BEGIN
		SELECT @managerId ManagerId, @driverId DriverId, 'FALSE' IsBoss
	END

	COMMIT

GO

-------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------

IF Object_id('[dbo].[usp_BL_GetOfferableUsers]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_BL_GetOfferableUsers] 
  END 

GO 

CREATE PROC [dbo].[usp_BL_GetOfferableUsers]
	@userId INT,
	@userRole varchar(20)
AS 
    BEGIN TRAN 

    DECLARE @offerableIUserIds TABLE 
      ( 
         Id INT 
      ) 

	--Who user can employ.
	--Driver for managers and vica versa
	DECLARE @targerRole varchar(20) = 'driver' 

	IF @userRole = 'driver'
	BEGIN
		SET @targerRole = 'manager'
	END

    INSERT INTO @offerableIUserIds 
    SELECT * 
    FROM   ((SELECT Users.Id 
             FROM   Roles 
                    INNER JOIN UsersXRoles 
                            ON Roles.Id = UsersXRoles.RoleId 
                    INNER JOIN Users 
                            ON UsersXRoles.UserId = Users.Id 
             WHERE  Roles.Name = @targerRole) 
            EXCEPT 
            (SELECT DriverId 
             FROM   ManagerXDrivers)) AS UnemployedIds 

    SELECT *,
	case when RecieverId = @userId then cast(1 as bit) else cast(0 as bit) end as IncommingOffer,
	case when SenderId = @userId then cast(1 as bit) else cast(0 as bit) end as OutgoingOffer,
	case when OfferDate is null then cast(1 as bit) else cast(0 as bit) end as HasNoOffers
    FROM   (SELECT * 
            FROM   Users 
            WHERE  Id IN (SELECT * 
                          FROM   @offerableIUserIds)) offerableUserIds 
           LEFT JOIN JobOffers 
                  ON ( ( offerableUserIds.Id = JobOffers.RecieverId 
                         AND JobOffers.SenderId = @userId ) 
                        OR ( offerableUserIds.Id = JobOffers.SenderId 
                             AND JobOffers.RecieverId = @userId ) ) 
                     AND ( JobOffers.OfferStatus = 'Pending' ) 

    COMMIT 

GO