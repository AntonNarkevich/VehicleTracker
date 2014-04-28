CREATE PROCEDURE SetConfig(@configName  VARCHAR(50), 
                           @configValue NVARCHAR(255)) 
AS 
  BEGIN 
      BEGIN TRAN 

      UPDATE Configuration 
      SET    Value = @configValue 
      WHERE  Name = @configName 

      IF @@rowcount = 0 
        BEGIN 
            INSERT INTO Configuration 
            VALUES      (@configName, 
                         @configValue) 
        END 

      COMMIT TRAN 
  END 

go 

CREATE PROCEDURE GetConfig(@configName  VARCHAR(50), 
                           @configValue NVARCHAR(255) OUTPUT) 
AS 
  BEGIN 
      SET @configValue = (SELECT Value 
                          FROM   Configuration 
                          WHERE  Name = @configName) 
  END 

go 

--print dbo.GetConfig('what')  