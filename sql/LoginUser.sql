USE [VehicleTrackerDB] 

go 

--DROP PROCEDURE dbo.LoginUser 

--go 

--      var manager1 = {    
--          id: 4,    
--          name: 'Manager id:4',    
--          roles: ['manager'],    
--          driverIds: [2, 3]    
--      };    

CREATE PROCEDURE LoginUser(@email         NVARCHAR(50), 
                           @passwordHash  NVARCHAR(50), 
                           @isSuccessfull BIT output, 
                           @errorMessage  NVARCHAR(50) output, 
                           @userId        UNIQUEIDENTIFIER output, 
                           @displayName   NVARCHAR(50) output) 
AS 
  BEGIN 
      DECLARE @truePasswordHash NVARCHAR(50) 

      SELECT @truePasswordHash = [PasswordHash], 
             @userId = [Id], 
             @displayName = [DisplayName] 
      FROM   [User] 
      WHERE  [Email] = @email 

      IF @truePasswordHash IS NULL 
        BEGIN 
            SET @isSuccessfull = 'FALSE' 
            SET @errorMessage = 'User with such email is not found.' 

            RETURN 
        END 

      IF @truePasswordHash != @passwordHash 
        BEGIN 
            SET @isSuccessfull = 'FALSE' 
            SET @errorMessage = 'Password is incorrect.' 

            RETURN 
        END 

      --Authenticated successfull. Gathering data.   
      --Getting roles     
      DECLARE @userRoles TABLE 
        ( 
           Name NVARCHAR(10) 
        ) 

      INSERT INTO @userRoles 
      SELECT Role.Name 
      FROM   Role 
             INNER JOIN UserRole 
                     ON Role.Id = UserRole.RoleId 
             INNER JOIN [User] 
                     ON UserRole.UresId = [User].Id 
      WHERE  [User].Id = @userId 

      --Getting employees   
      DECLARE @isManager BIT; 
      DECLARE @driverIds TABLE 
        ( 
           driverId UNIQUEIDENTIFIER 
        ) 

      IF ( EXISTS(SELECT * 
                  FROM   @userRoles 
                  WHERE  Name = 'manager') ) 
        BEGIN 
            INSERT INTO @driverIds 
            SELECT DriverId 
            FROM   ManagerDriver 
            WHERE  ManagerId = @userId 
        END 

      --Returning values    
      SET @isSuccessfull = 'TRUE' 

      SELECT Name as RoleName 
      FROM   @userRoles 

      SELECT DriverId
      FROM   @driverIds 
  END 

go 