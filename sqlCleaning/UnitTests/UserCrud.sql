-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

if object_id('ut_RolesExist') is not null
begin
	drop procedure ut_RolesExist
end
go

CREATE PROCEDURE ut_RolesExist AS 
BEGIN 
	declare @roleCount int

	select @roleCount = Count(*) from Roles

	if @roleCount <> 3
	begin
		exec tsu_failure 'Roles table is not initialized. It should contain 3 role (admin, manage, driver).'
	end
END        
go

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

if object_id('ut_AdminIsRegistered') is not null
begin
	drop procedure ut_AdminIsRegistered
end
go

CREATE PROCEDURE ut_AdminIsRegistered AS 
BEGIN 
	declare @adminCount int

	select @adminCount = count(*)
	from VW_UserRoles
	where RoleName = 'admin'

	if @adminCount < 1
	begin
		exec tsu_failure 'Admin is not registered.'
	end
END        
go

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

if object_id('ut_User_Create') is not null
begin
	drop procedure ut_User_Create
end
go

CREATE PROCEDURE ut_User_Create AS 
BEGIN

	declare @name varchar(20)
	set @name = 'TestUser' 

	declare @email varchar(320)
	set @email = 'what@mail.ru'

	exec usp_User_Insert @name, @email, 'what', 'what', 'false'

	declare @insertedName varchar(20)

	select @insertedName = Name
	from Users
	where Email = @email

	if @insertedName <> @name
	begin
		exec tsu_failure 'Inserted row has been changed or doesnt exist'
	end
END        
go

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

if object_id('ut_User_Select') is not null
begin
	drop procedure ut_User_Select
end
go

CREATE PROCEDURE ut_User_Select AS 
BEGIN
	declare @email varchar(320) = 'new@test.email'

	exec usp_User_Insert 'TestUser', @email, 'what', 'what', 'false'
	declare @insertedId int = SCOPE_IDENTITY()
			
	declare @InsertedUser table (
		Id           INT, 
		Name         NVARCHAR(20), 
		Email        VARCHAR(320), 
		PasswordHash VARCHAR(20), 
		Salt         VARCHAR(20), 
		IsBlocked    BIT
	)

	insert into @InsertedUser exec usp_User_Select @insertedId	

	declare @actualEmail varchar(320)

	select @actualEmail = Email
	from @InsertedUser
	where @insertedId = Id


	if @actualEmail <> @email
	begin
		exec tsu_failure 'Inserted row doesnt exist or has been changed.'
	end
END        
go

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

if object_id('ut_User_Update') is not null
begin
	drop procedure ut_User_Update
end
go

CREATE PROCEDURE ut_User_Update AS 
BEGIN
	
	exec usp_User_Insert 'TestUser', 'what@is.love', 'what', 'what', 'false'
	declare @insertedId int = SCOPE_IDENTITY()
			

	declare @emailToUpdate varchar(320) = 'new@test.email'
	exec usp_User_Update 1, 'TestUser', @emailToUpdate, 'what', 'what', 'false'
	

	declare @actualEmail varchar(320)

	select @actualEmail = Email
	from Users
	where @insertedId = Id


	if @actualEmail <> @emailToUpdate
	begin
		exec tsu_failure 'Row is not updated.'
	end
END        
go

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

if object_id('ut_User_Delete') is not null
begin
	drop procedure ut_User_Delete
end
go

CREATE PROCEDURE ut_User_Delete AS 
BEGIN
	
	exec usp_User_Insert 'TestUser', 'what@is.love', 'what', 'what', 'false'
	declare @insertedId int = SCOPE_IDENTITY()
			

	exec usp_User_Delete @insertedId

	declare @InsertedUserCount int

	select @InsertedUserCount = COUNT(*)
	from Users
	where Id = @insertedId
	
	if @InsertedUserCount <> 0
	begin
		exec tsu_failure 'Inserted row wasnt deleted.'
	end
END        
go

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------