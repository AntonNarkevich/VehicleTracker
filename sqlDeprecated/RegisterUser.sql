--Adds user to [dbo].[User]. Sets the role.
--Returns 0 and error message if:
--	1) Role is 'admin' and admin is already registered
--	2) Role is not found (doesn't exist in Role table)
--	3) User with such email already exists
CREATE PROCEDURE RegisterUser(@email         NVARCHAR(50), 
                              @passwordHash  NVARCHAR(50), 
                              @role          NCHAR(10), 
                              @isSuccessfull BIT output, 
                              @errorMessage  NVARCHAR(50) output) 
AS 
  BEGIN 
      IF ( @role = 'admin' ) 
        BEGIN 
            DECLARE @isManagerRegistered BIT 

            EXEC dbo.IsAdminRegistered 
              @isManagerRegistered output 

            IF ( @isManagerRegistered = 'TRUE' ) 
              BEGIN 
                  SET @isSuccessfull = 'FALSE' 
                  SET @errorMessage = 'Admin is already registerd' 

                  RETURN 
              END 
        END 

      IF EXISTS(SELECT * 
                FROM   [dbo].[User] 
                WHERE  [dbo].[User].email = @email) 
        BEGIN 
            SET @isSuccessfull = 'FALSE' 
            SET @errorMessage = 'User with such eail already exists.' 

            RETURN 
        END 

      DECLARE @newUserId UNIQUEIDENTIFIER; 

      SET @newUserId = NEWID() 

      INSERT INTO [dbo].[User] 
                  (Id, 
                   Email, 
                   PasswordHash, 
                   IsBlocked) 
      VALUES      (@newUserId, 
                   @email, 
                   @passwordHash, 
                   'FALSE') 
      
      DECLARE @roleId AS INT; 

      SELECT @roleId = Id 
      FROM   [dbo].[Role] 
      WHERE  [dbo].[Role].Name = @role 

	  --Default value is NULL  
      IF ( @roleId IS NULL ) 
        BEGIN 
            SET @isSuccessfull = 'FALSE' 
            SET @errorMessage = 'Role not found.' 

            RETURN 
        END 

      INSERT INTO [dbo].[UserRole] 
      VALUES      (@newUserId, 
                   @roleId) 

      SET @isSuccessfull = 'TRUE' 
  END 

go 