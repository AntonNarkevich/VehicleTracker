--Checks whether admin exists.  
--If config 'isAdminRegistered' is set to 'TRUE' returns 1.  
--Else goes through all the users.  
--IF admin if found returns 1 and sets config 'isAdminRegistered' to 'TRUE'.  
--IF admin is not found returns 0 and sets 'isAdminRegistered' to 'FALSE'.  
CREATE PROCEDURE IsAdminRegistered(@isAdminRegistered BIT output) 
AS 
  BEGIN 
      DECLARE @isAdminRegisteredConfigValue AS NVARCHAR(255) 

      EXEC dbo.GetConfig 
        'isAdminRegistered', 
        @isAdminRegisteredConfigValue output 

      IF @isAdminRegisteredConfigValue = 'TRUE' 
        BEGIN 
            SET @isAdminRegistered = 'TRUE' 

            RETURN 
        END 

      IF EXISTS(SELECT [User].Id 
                FROM   Role 
                       INNER JOIN UserRole 
                               ON Role.Id = UserRole.RoleId 
                       INNER JOIN [User] 
                               ON UserRole.UresId = [User].Id 
                WHERE  Role.Name = 'admin') 
        BEGIN 
            EXEC dbo.Setconfig 
              'isAdminRegistered', 
              'TRUE' 

            SET @isAdminRegistered = 'TRUE' 

            RETURN 
        END 

      EXEC dbo.Setconfig 
        'isAdminRegistered', 
        'FALSE' 

      SET @isAdminRegistered = 'FALSE' 

      RETURN 0 
  END 

go 