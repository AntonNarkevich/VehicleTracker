:setvar path "D:\Projects\VehicleTracker\sql\DatabaseStructure"

:r $(path)\CreateTableseAndViews.sql
GO

:setvar path "D:\Projects\VehicleTracker\sql\GeneratedStoredProcedures"

:r $(path)\JobOfferCRUD.ssmstp.sql
:r $(path)\MessageCRUD.ssmstp.sql
:r $(path)\UserCRUD.ssmstp.sql
:r $(path)\VehicleCRUD.ssmstp.sql
GO

:setvar path "D:\Projects\VehicleTracker\sql\StoredProcedures"

:r $(path)\JobOffer.sql
:r $(path)\Vehicle.sql
:r $(path)\BusinessLogic.sql
:r $(path)\Membership.sql
:r $(path)\Tracking.sql

GO

:setvar path "D:\Projects\VehicleTracker\sql\Util"

:r $(path)\Util.sql
GO