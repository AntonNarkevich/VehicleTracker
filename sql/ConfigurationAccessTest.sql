EXEC [dbo].SetConfig 
  'TestConfig', 
  'TestConfigValue' 

go 

DECLARE @return_value VARCHAR(50) 

EXEC [dbo].[GetConfig] 
  'TestConfig', 
  @return_value output 

SELECT 'Return Value' = @return_value 

go 