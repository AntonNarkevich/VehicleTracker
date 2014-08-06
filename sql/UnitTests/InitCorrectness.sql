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