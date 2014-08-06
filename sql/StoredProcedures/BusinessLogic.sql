USE VehicleTrackerDb 

GO 

--Rejects all pending job offers for the driver.  
--Sets DecisionDate equal to current date and time.  
IF OBJECT_ID('[dbo].[usp_BL_Driver_RejectPendingJobOffers]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_BL_Driver_RejectPendingJobOffers] 
  END 

GO 

CREATE PROC [dbo].[usp_BL_Driver_RejectPendingJobOffers] @driverId INT 
AS 
    UPDATE [dbo].[JobOffers] 
    SET    [OfferStatus] = 'Rejected', 
           [DecisionDate] = GETDATE() 
    WHERE  ( [SenderId] = @driverId 
              OR [RecieverId] = @driverId ) 
           AND [OfferStatus] = 'Pending' 

GO 

-------------------------------------------------------------------------------------------------------  
-------------------------------------------------------------------------------------------------------  
IF OBJECT_ID('[dbo].[usp_BL_Manager_GetDriverIds]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_BL_Manager_GetDriverIds] 
  END 

GO 

CREATE PROC [dbo].[usp_BL_Manager_GetDriverIds] @managerId INT 
AS 
    SELECT DriverId 
    FROM   VW_ManagerDrivers 
    WHERE  ManagerId = @managerId 

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

CREATE PROC [dbo].[usp_BL_Manager_EmployDriver] @managerId INT, 
                                                @driverId  INT 
AS 
    BEGIN TRAN 

    EXEC usp_JobOffer_Accept 
      @managerId, 
      @driverId 

    EXEC usp_JobOffer_Accept 
      @driverId, 
      @managerId 

    EXEC usp_BL_Driver_RejectPendingJobOffers 
      @driverId 

    INSERT INTO ManagerXDrivers 
                (ManagerId, 
                 DriverId) 
    VALUES      (@managerId, 
                 @driverId) 

    COMMIT 

GO 

-------------------------------------------------------------------------------------------------------  
-------------------------------------------------------------------------------------------------------  
--Takes a car from driver.  
--Removes from employee list.  
IF OBJECT_ID('[dbo].[usp_BL_Manager_FireDriver]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_BL_Manager_FireDriver] 
  END 

GO 

CREATE PROC [dbo].[usp_BL_Manager_FireDriver] @managerId INT, 
                                              @driverId  INT 
AS 
    BEGIN TRAN 

    EXEC usp_Vehicle_TakeFromDriver 
      @managerId, 
      @driverId 

    DELETE FROM ManagerXDrivers 
    WHERE  DriverId = @driverId 
           AND ManagerId = @managerId 

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

CREATE PROC [dbo].[usp_BL_Manager_GetEmployees] @managerId INT 
AS 
    SELECT DriverId, 
           Email, 
           IsBlocked 
    FROM   ManagerXDrivers 
           INNER JOIN Users 
                   ON ManagerXDrivers.DriverId = Users.Id 
    WHERE  ManagerId = @managerId 

GO 

-------------------------------------------------------------------------------------------------------  
-------------------------------------------------------------------------------------------------------  
--Gets employees for particular manager  
IF OBJECT_ID('[dbo].[usp_BL_Manager_GetEmployeesWithoutVehicle]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_BL_Manager_GetEmployeesWithoutVehicle] 
  END 

GO 

CREATE PROC [dbo].[usp_BL_Manager_GetEmployeesWithoutVehicle] @managerId INT 
AS 
    SELECT Id, 
           Email, 
           IsBlocked 
    FROM   (ManagerXDrivers 
            INNER JOIN Users 
                    ON ManagerXDrivers.DriverId = Users.Id) 
    WHERE  ManagerId = @managerId 
           AND NOT EXISTS (SELECT * 
                           FROM   DriverXVehicle 
                           WHERE  DriverId = Users.Id) 

GO 

-------------------------------------------------------------------------------------------------------  
-------------------------------------------------------------------------------------------------------  
--Gets employees for particular manager  
IF OBJECT_ID('[dbo].[usp_BL_Driver_GetBoss]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_BL_Driver_GetBoss] 
  END 

GO 

CREATE PROC [dbo].[usp_BL_Driver_GetBoss] @driverId INT 
AS 
    SELECT ManagerId AS BossId, 
           Email     AS BossEmail 
    FROM   ManagerXDrivers 
           INNER JOIN Users 
                   ON ManagerXDrivers.ManagerId = Users.Id 
    WHERE  DriverId = @driverId 

GO 

-------------------------------------------------------------------------------------------------------  
-------------------------------------------------------------------------------------------------------  
--Checks whether the manager is employer for the driver  
IF OBJECT_ID('[dbo].[usp_BL_Manager_IsBossFor]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_BL_Manager_IsBossFor] 
  END 

GO 

CREATE PROC [dbo].[usp_BL_Manager_IsBossFor] @managerId INT, 
                                             @driverId  INT 
AS 
    DECLARE @employmentInfo TABLE 
      ( 
         ManagerId INT, 
         DriverId  INT, 
         IsBoss    BIT 
      ) 

    INSERT INTO @employmentInfo 
    SELECT ManagerId, 
           DriverId, 
           cast(1 AS BIT) 
    FROM   ManagerXDrivers 
    WHERE  ManagerId = @managerId 
           AND DriverId = @driverId 

    IF ( @@ROWCOUNT = 0 ) 
      BEGIN 
          INSERT INTO @employmentInfo 
          VALUES      (@managerId, 
                       @managerId, 
                       cast(0 AS BIT)) 
      END 

    SELECT * 
    FROM   @employmentInfo 

GO 

-------------------------------------------------------------------------------------------------------  
-------------------------------------------------------------------------------------------------------  
IF OBJECT_ID('[dbo].[usp_BL_Manager_IsVehicleOwner]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_BL_Manager_IsVehicleOwner] 
  END 

GO 

CREATE PROC [dbo].[usp_BL_Manager_IsVehicleOwner] @managerId INT, 
                                                  @vehicleId INT 
AS 
    DECLARE @ownershipInfo TABLE 
      ( 
         ManagerId INT, 
         DriverId  INT, 
         IsOwner   BIT 
      ) 

    INSERT INTO @ownershipInfo 
    SELECT @managerId     ManagerId, 
           @vehicleId     DriverId, 
           cast(1 AS BIT) IsOwner 
    FROM   Vehicles 
    WHERE  Vehicles.ManagerId = @managerId 
           AND Vehicles.Id = @vehicleId 

    IF ( @@ROWCOUNT = 0 ) 
      BEGIN 
          INSERT INTO @ownershipInfo 
          VALUES      (@managerId, 
                       @vehicleId, 
                       cast(0 AS BIT)) 
      END 

    SELECT * 
    FROM   @ownershipInfo 

GO 

-------------------------------------------------------------------------------------------------------  
-------------------------------------------------------------------------------------------------------  
IF Object_id('[dbo].[usp_BL_GetOfferableUsers]') IS NOT NULL 
  BEGIN 
      DROP PROC [dbo].[usp_BL_GetOfferableUsers] 
  END 

GO 

CREATE PROC [dbo].[usp_BL_GetOfferableUsers] @userId   INT, 
                                             @userRole VARCHAR(20) 
AS 
    BEGIN TRAN 

    DECLARE @offerableIUserIds TABLE 
      ( 
         Id INT 
      ) 
    --Who user can employ.  
    --Driver for managers and vica versa  
    DECLARE @targerRole VARCHAR(20) = 'driver' 

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

    SELECT offerableUserIds.Id AS Id, 
           Name, 
           Email, 
           IsBlocked, 
           JobOffers.Id        AS OfferId, 
           CASE 
             WHEN RecieverId = @userId THEN cast(1 AS BIT) 
             ELSE cast(0 AS BIT) 
           END                 AS IncommingOffer, 
           CASE 
             WHEN SenderId = @userId THEN cast(1 AS BIT) 
             ELSE cast(0 AS BIT) 
           END                 AS OutgoingOffer, 
           CASE 
             WHEN OfferDate IS NULL THEN cast(1 AS BIT) 
             ELSE cast(0 AS BIT) 
           END                 AS HasNoOffers 
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