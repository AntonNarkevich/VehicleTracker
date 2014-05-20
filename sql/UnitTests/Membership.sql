use VehicleTrackerDb
go

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

if object_id('ut_AddRole') is not null
begin
	drop procedure ut_AddRole
end
go

CREATE PROCEDURE ut_AddRole AS
BEGIN
	exec usp_User_Insert 'Tesdt Uddfser', 'wddha223st@is.love', 'asdf', 'asdf', 'false'
	declare @id int = IDENT_CURRENT('Users')

	print 'The id is' + cast(@id as varchar (20))

	exec usp_MBSP_User_AddRole @id, 'admin'
	exec usp_MBSP_User_AddRole @id, 'driver'
	exec usp_MBSP_User_AddRole @id, 'manager'

	declare @userRoles table (
		RoleName varchar(20)
	)

	insert into @userRoles exec usp_MBSP_User_GetRolesById @id

	declare @rolesCount int

	select @rolesCount = count(*) from
	@userRoles

	if @rolesCount = 0
	begin
		exec tsu_failure 'Roles were not added.'
	end

	declare @extraRolesCount int

	declare @allRoles table (
		RoleName varchar(20)
	)

	insert into @allRoles values('admin')
	insert into @allRoles values('manager')
	insert into @allRoles values('driver')

	select @extraRolesCount = count(*)
	from
	(select * from @userRoles
	EXCEPT
	select * from @allRoles) as ExtraRoles

	if @extraRolesCount <> 0
	begin
		exec tsu_failure 'Extra roles has appeared or incorrect roles were added.'
	end
END
go

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

if object_id('ut_RemoveRole') is not null
begin
	drop procedure ut_RemoveRole
end
go

CREATE PROCEDURE ut_RemoveRole AS
BEGIN
	exec usp_User_Insert 'Tesdt Uddfser', 'wddha223st@is.love', 'asdf', 'asdf', 'false'
	declare @id int = IDENT_CURRENT('Users')

	exec usp_MBSP_User_AddRole @id, 'admin'
	exec usp_MBSP_User_AddRole @id, 'driver'
	exec usp_MBSP_User_AddRole @id, 'manager'

	declare @userRoles table (
		RoleName varchar(20)
	)

	insert into @userRoles exec usp_MBSP_User_GetRolesById @id

	declare @roleCount int

	select @roleCount = count(*)
	from @userRoles

	if @roleCount = 0
	begin
		exec tsu_failure 'Roles were not added.'
	end

	exec usp_MBSP_User_RemoveRole @id, 'admin'
	exec usp_MBSP_User_RemoveRole @id, 'driver'
	exec usp_MBSP_User_RemoveRole @id, 'manager'

	if @roleCount <> 0
	begin
		exec tsu_failure 'Roles were not removed.'
	end
END
go

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

if object_id('ut_GetRolesById') is not null
begin
	drop procedure ut_GetRolesById
end
go

CREATE PROCEDURE ut_GetRolesById AS
BEGIN
	declare @userId int

	select top 1 @UserId = Id
	from Users

	exec usp_MBSP_User_GetRolesById @userId

END
go

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------