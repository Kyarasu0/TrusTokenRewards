CREATE TABLE Identify (
    UserID        VARCHAR(255) PRIMARY KEY,
    Password      VARCHAR(255) NOT NULL,
    Address       VARCHAR(255) NOT NULL,
    PrivateKey    TEXT NOT NULL
);

CREATE TABLE Mosaic (
    MosaicID      VARCHAR(255) PRIMARY KEY,
    MosaicName    VARCHAR(100) UNIQUE NOT NULL,
    OwnerUserID   VARCHAR(255) NOT NULL,
    FOREIGN KEY (OwnerUserID) REFERENCES Identify(UserID)
);

CREATE TABLE RoomDetails (
    RoomName         VARCHAR(100) PRIMARY KEY,
    RoomPassword     VARCHAR(255) NOT NULL,
    RoomIconPath     VARCHAR(255),
    MosaicName       VARCHAR(100) NOT NULL,

    FOREIGN KEY (MosaicName) REFERENCES Mosaic(MosaicName)
);

CREATE TABLE Rooms (
    UserID    VARCHAR(255) NOT NULL,
    RoomName  VARCHAR(100) NOT NULL,

    PRIMARY KEY (UserID, RoomName),
    FOREIGN KEY (UserID) REFERENCES Identify(UserID)
        ON DELETE CASCADE,
    FOREIGN KEY (RoomName) REFERENCES RoomDetails(RoomName)
        ON DELETE CASCADE
);

CREATE TABLE Projects (
    ProjectsID      INT AUTO_INCREMENT PRIMARY KEY,
    UserID          VARCHAR(255) NOT NULL,
    RoomName        VARCHAR(100) NOT NULL,
    CreateDate      DATETIME NOT NULL,
    Content         TEXT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Identify(UserID)
        ON DELETE CASCADE,
    FOREIGN KEY (RoomName) REFERENCES RoomDetails(RoomName)
        ON DELETE CASCADE
);

CREATE TABLE ProjectDetails (
    ProjectsID INT NOT NULL,
    fromUserID VARCHAR(255) NOT NULL,
    Date       DATETIME NOT NULL,
    Amount     INT NOT NULL,
    TxID       VARCHAR(255) NOT NULL,

    FOREIGN KEY (ProjectsID) REFERENCES Projects(ProjectsID)
        ON DELETE CASCADE,
    FOREIGN KEY (fromUserID) REFERENCES Identify(UserID)
        ON DELETE CASCADE
);