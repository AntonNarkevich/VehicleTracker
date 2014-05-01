declare @isSuccess bit
declare @errMessage NVARCHAR(50)

exec RegisterUser 'what@asdf.com', 'hash', 'manager', @isSuccess output, @errMessage output

select 'isSuccessfull' = @isSuccess
select 'errMessage' = @errMessage