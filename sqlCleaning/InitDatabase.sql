:setvar path "D:\Projects\VehicleTracker\sqlCleaning\DatabaseStructure"

:r $(path)\CreateTableseAndViews.sql
GO

:setvar path "D:\Projects\VehicleTracker\sqlCleaning\GeneratedStoredProcedures"

:r $(path)\JobOfferCRUD.ssmstp.sql
:r $(path)\MessageCRUD.ssmstp.sql
:r $(path)\UserCRUD.ssmstp.sql
:r $(path)\VehicleCRUD.ssmstp.sql
GO

:setvar path "D:\Projects\VehicleTracker\sqlCleaning\StoredProcedures"

:r $(path)\JobOffer.sql
:r $(path)\Vehicle.sql
:r $(path)\Membership.sql
:r $(path)\BusinessLogic.sql
GO