DECLARE @isAdminRegistered BIT 

EXEC dbo.isAdminRegistered 
  @isAdminRegistered output 

SELECT 'Admin exists' = @isAdminRegistered 