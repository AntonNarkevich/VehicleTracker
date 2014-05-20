USE [VehicleTrackerDB] 

go 

--CREATE PROCEDURE LoginUser(@email         NVARCHAR(50), 
--                           @passwordHash  NVARCHAR(50), 
--                           @isSuccessfull BIT output, 
--                           @errorMessage  NVARCHAR(50) output, 
--                           @userId        UNIQUEIDENTIFIER output, 
--                           @displayName   NVARCHAR(50) output) 

DECLARE @isSuccess BIT 
DECLARE @errMessage NVARCHAR(50) 
declare @userId        UNIQUEIDENTIFIER 
declare @displayName   NVARCHAR(50)

EXEC LoginUser 
  'what@asdf.com', 
  'hash', 
  @isSuccess output, 
  @errMessage output, 
  @userId output,
  @displayName output

SELECT 'isSuccessfull' = @isSuccess 
SELECT 'errMessage' = @errMessage 
SELECT 'userId' = @userId
SELECT 'DisplayName' = @displayName

go 