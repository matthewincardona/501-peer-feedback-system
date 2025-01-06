DROP DATABASE IF EXISTS PeerFeedback;
CREATE DATABASE PeerFeedback;

USE PeerFeedback;

-- Create tables
CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    UserName VARCHAR(35) NOT NULL,
    UserEmail VARCHAR(35),
    Password VARCHAR(30) NOT NULL,
    FirstName VARCHAR(35),
    LastName VARCHAR(35),
    AccessLevel ENUM('User', 'Creator', 'Admin') NOT NULL
);

CREATE TABLE Evaluation_Group (
    GroupID INT PRIMARY KEY AUTO_INCREMENT,
    GroupName VARCHAR(35) NOT NULL,
    Created DATETIME NOT NULL,
    CreatorID INT NOT NULL,
    FOREIGN KEY (CreatorID) REFERENCES User(UserID) ON DELETE CASCADE
);

CREATE TABLE User_List (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    GroupID INT,
    UserID INT,
    UserPermission ENUM('Responder', 'Creator'),
    CreatorPermissions JSON,
    FormCompleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (GroupID) REFERENCES Evaluation_Group(GroupID) ON DELETE CASCADE
);


CREATE TABLE Form (
    FormID INT PRIMARY KEY AUTO_INCREMENT,
    FormName VARCHAR(35) NOT NULL,
    CreatorID INT,
    GroupID INT,
    Created DATETIME NOT NULL,
    Assigned DATETIME,
    Deadline DATETIME,
    QuestionList JSON,
    FOREIGN KEY (CreatorID) REFERENCES User(UserID) ON DELETE SET NULL,
    FOREIGN KEY (GroupID) REFERENCES Evaluation_Group(GroupID) ON DELETE SET NULL
);

CREATE TABLE User_Answers (
    AnswersID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    ReviewedID INT,
    FormID INT,
    Submission DATETIME NOT NULL,
    Submitted BOOLEAN,
    Answers JSON,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ReviewedID) REFERENCES User(UserID) ON DELETE SET NULL,
    FOREIGN KEY (FormID) REFERENCES Form(FormID) ON DELETE CASCADE
);

CREATE TABLE Evaluation_Teams (
    TeamID INT PRIMARY KEY AUTO_INCREMENT,
    GroupID INT,
    TeamName VARCHAR(35),
    Created DATETIME,
    FOREIGN KEY (GroupID) REFERENCES Evaluation_Group(GroupID) ON DELETE CASCADE
);

CREATE TABLE Team_User_List (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    TeamID INT,
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (TeamID) REFERENCES Evaluation_Teams(TeamID) ON DELETE CASCADE
);
