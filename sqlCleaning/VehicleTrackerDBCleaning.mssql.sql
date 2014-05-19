--#region Recreate Database
USE master 

GO 

IF EXISTS(SELECT * 
          FROM   sys.databases 
          WHERE  name = 'VehicleTrackerDBCleaning') 
  BEGIN 
      DROP DATABASE VehicleTrackerDBCleaning 

      CREATE DATABASE VehicleTrackerDBCleaning 
  END 

GO
--#endregion 

USE VehicleTrackerDBCleaning 

GO

--#region Create Tables
CREATE TABLE Users 
  ( 
     Id           INT PRIMARY KEY IDENTITY, 
     Name         NVARCHAR(20), 
     Email        VARCHAR(320) UNIQUE NOT NULL, 
     PasswordHash VARCHAR(20) NOT NULL, 
     Salt         VARCHAR(20) NOT NULL, 
     --TODO: Set porper types for PasswordHash and Salt 
     IsBlocked    BIT DEFAULT 'false' NOT NULL 
  ) 

CREATE TABLE Roles 
  ( 
     Id   INT PRIMARY KEY IDENTITY, 
     Name VARCHAR (20) UNIQUE NOT NULL 
  )
  
INSERT INTO Roles 
            (Name) 
VALUES      ('admin'), 
            ('manager'), 
            ('driver') 

CREATE TABLE UsersXRoles 
  ( 
     UserId INT FOREIGN KEY REFERENCES Users(Id), 
     RoleId INT FOREIGN KEY REFERENCES Roles(Id) 
     PRIMARY KEY (UserId, RoleId) 
  ) 

CREATE TABLE JobOffers 
  ( 
     --TODO: Inconsistency. Manager offers a job. Driver applies for a job. This should cause autosubmit.
     SenderId     INT FOREIGN KEY REFERENCES Users(Id), 
     RecieverId   INT FOREIGN KEY REFERENCES Users(Id), 
     OfferStatus  VARCHAR(20) DEFAULT 'Pending' NOT NULL, 
     OfferDate    DATETIME NOT NULL, 
     DecisionDate DATETIME NOT NULL, 
     PRIMARY KEY (SenderId, RecieverId) 
  ) 

CREATE TABLE Messages 
  ( 
     Id          INT PRIMARY KEY IDENTITY, 
     SenderId    INT FOREIGN KEY REFERENCES Users(Id) NOT NULL, 
     RecieverId  INT FOREIGN KEY REFERENCES Users(Id) NOT NULL, 
     MessageText NVARCHAR(1000) NOT NULL, 
     IsRead      BIT DEFAULT 'false' NOT NULL 
  ) 

CREATE TABLE ManagerXDrivers 
  ( 
     DriverId  INT FOREIGN KEY REFERENCES Users(Id) PRIMARY KEY, 
     ManagerId INT FOREIGN KEY REFERENCES Users(Id) NOT NULL, 
  ) 

CREATE TABLE Vehicles 
  ( 
     Id        INT PRIMARY KEY IDENTITY, 
     ManagerId INT FOREIGN KEY REFERENCES Users(Id) NOT NULL, 
     Name      NVARCHAR(30) NOT NULL, 
     Info      NVARCHAR(600) 
  ) 

CREATE TABLE VehicleXPositions 
  ( 
     Id           INT PRIMARY KEY IDENTITY, 
     VehicleId    INT FOREIGN KEY REFERENCES Vehicles(Id) NOT NULL, 
     CheckoutDate DATETIME NOT NULL, 
     POSITION     GEOGRAPHY NOT NULL 
  ) 

CREATE TABLE DriverXVehicle 
  ( 
     DriverId  INT FOREIGN KEY REFERENCES Users(Id) PRIMARY KEY, 
     VehicleId INT FOREIGN KEY REFERENCES Vehicles(Id) NOT NULL 
  ) 
GO
--#endregion


--#region Create Views
CREATE VIEW [VW_UserRoles] 
AS 
  SELECT Users.Id Id, 
         Email, 
         Roles.Name 
  FROM   Roles 
         INNER JOIN Users 
                 ON Roles.Id = Users.Id 
         INNER JOIN UsersXRoles 
                 ON Roles.Id = UsersXRoles.RoleId 
                    AND Users.Id = UsersXRoles.UserId 

GO

CREATE VIEW [VW_ManagerDrivers] 
AS 
  SELECT ManagerId, 
         DriverId 
  FROM   ManagerXDrivers 
         INNER JOIN Users 
                 ON ManagerXDrivers.DriverId = Users.Id 
                    AND ManagerXDrivers.ManagerId = Users.Id 

GO 

CREATE VIEW [VW_DriverVehicle] 
AS 
  SELECT * 
  FROM   DriverXVehicle 
         INNER JOIN Vehicles 
                 ON DriverXVehicle.VehicleId = Vehicles.Id 

GO
--#endregion 