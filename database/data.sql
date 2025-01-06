-- Dummy Data for PeerFeedback Database

-- Insert into User table
INSERT INTO User (UserName, UserEmail, Password, FirstName, LastName, AccessLevel)
VALUES 
('jdoe', 'jdoe@rit.edu', 'Password123', 'John', 'Doe', 'Creator'),
('asmith', 'asmith@rit.edu', 'Password123', 'Anna', 'Smith', 'Admin'),
('bjones', 'bjones@rit.edu', 'Password123', 'Bob', 'Jones', 'Creator'),
('mincard', 'mincard@rit.edu', 'Password123', 'Matthew', 'Incardona', 'User'),
('swhite', 'swhite@rit.edu', 'Password123', 'Susan', 'White', 'User'),
('aapollo', 'aapollo@rit.edu', 'Password123', 'Andrew', 'Apollo', 'User');

-- Insert into Evaluation_Group table
INSERT INTO Evaluation_Group (GroupName, `Created`, CreatorID)
VALUES 
('Group A', '2024-09-20 10:30:00', 2), 
('Group B', '2024-09-21 14:15:00', 1);

-- Insert into User_list table
INSERT INTO User_List (GroupID, UserID, UserPermission, CreatorPermissions)
VALUES 
(1, 1, 'Responder', NULL),  -- John as a responder
(1, 2, 'Creator', '{"canEditForm": true, "canViewGroup": true, "canDeleteForm": true, "canSeeResponses": true}'),
(1, 3, 'Responder', NULL),  -- Bob as a responder

-- For Group B
(2, 4, 'Creator', '{"canEditForm": false, "canViewGroup": true, "canDeleteForm": false, "canSeeResponses": true}'),  -- Andrew as a creator with limited permissions
(2, 1, 'Responder', NULL); 

-- Insert into Form table
INSERT INTO Form (FormName, CreatorID, GroupID, `Created`, Assigned, Deadline, QuestionList)
VALUES 
('Feedback Form 1', 2, 1, '2024-09-20 11:00:00', '2024-09-20 11:00:00', '2024-09-25 17:00:00', '[{"text":"Long Answer Question Name","type":"Long Answer","title":"","description":"","ratingScale":null}]'),
('Feedback Form 2', 1, 2, '2024-09-21 15:00:00', '2024-09-21 15:00:00', '2024-09-30 23:59:00', '[{"text":"Long Answer Question Name","type":"Long Answer","title":"","description":"","ratingScale":null}]');

-- Insert into User_Answers table
INSERT INTO User_Answers (UserID, ReviewedID, FormID, Submission, Submitted, Answers)
VALUES 
(1, 3, 1, '2024-09-23 10:00:00', 1, '{"What were some weakness":"Bob weakness was his communication skills"}'),
(3, 1, 1, '2024-09-23 10:00:00', 1, '{"What were some weakness":"John weakness was his time management"}'),
(3, 1, 2, '2024-09-24 09:30:00', 1, '{"Name one of your fav artist":"Joey, Badass"}');

-- Insert into Evaluation_Teams table
INSERT INTO Evaluation_Teams (GroupID, TeamName, `Created`)
VALUES 
(1, 'Team 1A', '2024-09-22 09:00:00'),
(2, 'Team 2B', '2024-09-23 08:30:00');

-- Insert into Team_User_List table
INSERT INTO Team_User_List (TeamID, UserID)
VALUES 
(1, 1),
(1, 3),
(2, 3);
