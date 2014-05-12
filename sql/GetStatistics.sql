USE VehicleTrackerDB 

go 

IF object_id('GetStatistics', 'P') IS NOT NULL 
  BEGIN 
      DROP PROCEDURE GetStatistics 
  END 

go 

CREATE PROCEDURE GetStatistics(@VehicleId UNIQUEIDENTIFIER) 
AS 
  BEGIN 
      SELECT *, 
             Rank() 
               OVER ( 
                 ORDER BY Id) AS 'PositionNumber' 
      INTO   #numberedPositions 
      FROM   VehiclePosition 
      WHERE  VehicleId = @VehicleId 

      --TODO: What happends 
      SELECT prevPosition.Position.Lat                              AS 
             'StartLatitude', 
             prevPosition.Position.Long                             AS 
             'StartLongitude', 
             curPosition.Position.Lat                               AS 
             'EndLatitude', 
             curPosition.Position.Long                              AS 
             'EndLongitude', 
             prevPosition.Position.STDistance(curPosition.Position) AS 
             'Distance', 
             CONVERT(VARCHAR(11), curPosition.[Date], 103)          AS
			 'EndDate' 
      FROM   #numberedPositions AS prevPosition 
             JOIN #numberedPositions AS curPosition 
               ON prevPosition.PositionNumber = curPosition.PositionNumber - 1 
  END 

go