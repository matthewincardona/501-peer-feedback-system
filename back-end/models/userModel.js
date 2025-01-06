const db = require('../services/connectToDB');

module.exports = {

    getUsersByGroupId: (groupId) => {
        // console.log(`Fetching users for group ID: ${groupId}`); // Debug log
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.UserID, u.UserName, u.FirstName, u.LastName, ul.UserPermission
                FROM User u
                JOIN User_List ul ON u.UserID = ul.UserID
                WHERE ul.GroupID = ?
            `;
            db.execute(query, [groupId]) // Use execute for parameterized query
                .then(([results]) => {
                    resolve(results);
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    addUser: (userData) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO User (UserName, Password, FirstName, LastName, AccessLevel)
                VALUES (?, ?, ?, ?, ?)
            `;
            const values = [
                userData.userName,
                userData.password,
                userData.firstName,
                userData.lastName,
                userData.accessLevel || 'User'
            ];

            db.execute(query, values)
                .then(([result]) => {
                    resolve({
                        userId: result.insertId,
                        ...userData
                    });
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    deleteUser: (username) => {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM User
                WHERE UserName = ?
            `;
            db.execute(query, [username])
                .then(([result]) => {
                    if (result.affectedRows === 0) {
                        reject(new Error('User not found'));
                    }
                    resolve({ message: 'User deleted successfully' });
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    getUserByUsername: (username) => {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT u.UserID, u.UserName, u.FirstName, u.LastName, u.AccessLevel,
                GROUP_CONCAT(DISTINCT eg.CreatorID) AS CreatorIDs
            FROM User u
            LEFT JOIN User_List ul ON u.UserID = ul.UserID
            LEFT JOIN Evaluation_Group eg ON ul.GroupID = eg.GroupID
            WHERE u.UserName = ?
            GROUP BY u.UserID
        `;
            db.execute(query, [username])
                .then(([results]) => {
                    if (results.length === 0) {
                        reject(new Error('User not found'));
                    } else {
                        // Parse the CreatorIDs into an array
                        results[0].CreatorIDs = results[0].CreatorIDs
                            ? results[0].CreatorIDs.split(',').map(id => parseInt(id))
                            : [];
                        resolve(results[0]);
                    }
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    searchUser: (userEmail) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT UserID, FirstName, LastName, UserName
                FROM User
                WHERE UserEmail = ?
            `;
            db.execute(query, [userEmail])
                .then(([results]) => {
                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        resolve(null); // No user found
                    }
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    setCreator: (groupId, creatorId, permissions) => {
        return new Promise((resolve, reject) => {
            const query = `
            INSERT INTO User_List (GroupID, UserID, UserPermission, CreatorPermissions)
            VALUES (?, ?, 'Creator', ?)
        `;
            const values = [groupId, creatorId, JSON.stringify(permissions)];

            db.execute(query, values)
                .then(([result]) => {
                    resolve({
                        id: result.insertId,
                        groupId,
                        creatorId,
                        permissions
                    });
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    setResponder: (groupID, responderID, teamID) => {
        return new Promise((resolve, reject) => {
            const userListQuery = `
                INSERT INTO User_List (GroupID, UserID, UserPermission, CreatorPermissions)
                VALUES (?, ?, 'Responder', NULL);
            `;

            const teamUserListQuery = `
                INSERT INTO Team_User_List (TeamID, UserID)
                VALUES (?, ?);
            `;

            const userListValues = [groupID, responderID];
            const teamUserListValues = [teamID, responderID];

            // Start with inserting into User_List
            db.execute(userListQuery, userListValues)
                .then(() => {
                    // Once User_List insertion is done, insert into Team_User_List
                    return db.execute(teamUserListQuery, teamUserListValues);
                })
                .then(() => {
                    resolve({
                        groupID,
                        responderID,
                        teamID
                    });
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    getCreatorPermissions: (CreatorID, GroupID) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT CreatorPermissions From User_list WHERE UserId = ? AND GroupID = ? AND UserPermission = 'Creator'";
            db.execute(query, [CreatorID, GroupID])
                .then(([result]) => {
                    if (result.length === 0) {
                        resolve({ permissions: [] }); // No permissions found
                    } else {
                        resolve({ permissions: result[0].CreatorPermissions });
                    }
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    setCreatorPermissions: (CreatorID, Permissions, GroupID) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE User_list SET CreatorPermissions = ? WHERE UserID = ? and GroupID = ? and UserPermission = "Creator"';
            db.execute(query, [Permissions, CreatorID, GroupID])
                .then(([result]) => {
                    resolve(result);
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        })
    },

    getCreators: (groupID) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.UserID, u.UserName, u.FirstName, u.LastName, u.UserEmail, u.AccessLevel
                FROM User u
                JOIN User_List ul ON u.UserID = ul.UserID
                WHERE ul.GroupID = ? AND ul.UserPermission = 'Creator';
            `;
            db.execute(query, [groupID])
                .then(([results]) => {
                    resolve(results);  // Return the list of creators
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    getResponders: (groupID) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT DISTINCT u.UserID, u.UserName, u.FirstName, u.LastName, u.UserEmail, u.AccessLevel, t.TeamID, t.TeamName, ul.GroupID, ul.UserPermission
                FROM 
                    User u
                JOIN 
                    User_List ul ON u.UserID = ul.UserID
                JOIN 
                    Team_User_List tul ON u.UserID = tul.UserID
                JOIN 
                    Evaluation_Teams t ON tul.TeamID = t.TeamID AND t.GroupID = ul.GroupID
                WHERE 
                    ul.GroupID = ? 
                    AND ul.UserPermission = 'Responder';
            `;
    
            db.execute(query, [groupID])
                .then(([results]) => {
                    resolve(results); // Return only responders with a team
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },
    
        
    deleteUserFromGroup: (groupID, userID) => {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM User_List
                WHERE GroupID = ? AND UserID = ?;
            `;
            db.execute(query, [groupID, userID])
                .then(([result]) => {
                    if (result.affectedRows === 0) {
                        reject(new Error('User not found in group'));
                    } else {
                        resolve({ message: 'User deleted from group successfully' });
                    }
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT UserID, UserName, FirstName, LastName, AccessLevel FROM User;`;

            db.execute(query)
                .then(([results]) => {
                    console.log('Database query executed successfully, results:', results);
                    resolve(results);
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    updateUserAccessLevel: (userID, newAccessLevel) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE User 
                SET AccessLevel = ? 
                WHERE UserID = ?
            `;
            db.execute(query, [newAccessLevel, userID])
                .then(([result]) => {
                    if (result.affectedRows === 0) {
                        reject(new Error('No user found with the provided UserID.'));
                    } else {
                        resolve(result);
                    }
                })
                .catch(err => {
                    console.error('Database update error:', err);
                    reject(err);
                });
        });
    },

    getUserById: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT UserName, CONCAT(FirstName, ' ', LastName) AS FullName
            FROM User
            WHERE UserID = ?
          `;
            db.execute(query, [userId])
                .then(([results]) => {
                    resolve(results[0]); // Resolve with the first result
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    }


}