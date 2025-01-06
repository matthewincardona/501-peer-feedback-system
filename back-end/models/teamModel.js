const db = require('../services/connectToDB');

module.exports = {
    getTeamsByGroupId: (groupId) => {
        // console.log(`Fetching teams for group ID: ${groupId}`); // Debug log
        return new Promise((resolve, reject) => {
            const query = `
                SELECT TeamID, TeamName
                FROM Evaluation_Teams
                WHERE GroupID = ?
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

    getUsersInTeam: (TeamID) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT DISTINCT 
                    user.UserID, 
                    user.UserName, 
                    user.FirstName, 
                    user.LastName, 
                    user.AccessLevel,
                    CONCAT(user.FirstName, ' ', user.LastName) AS Name
                FROM \`User\` AS user
                JOIN \`Team_User_List\` AS tul ON user.UserID = tul.UserID
                WHERE tul.TeamID = ?;
            `;

            db.execute(query, [TeamID])
                .then(([results]) => {
                    console.log('Query results in model:', results); // Debugging line
                    resolve(results);
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    createTeam: (GroupID, TeamName) => {
        return new Promise((resolve, reject) => {
            const insertQuery = `
                INSERT INTO Evaluation_Teams (GroupID, TeamName, Created)
                VALUES (?, ?, NOW());
            `;

            db.execute(insertQuery, [GroupID, TeamName])
                .then(([result]) => {
                    const teamID = result.insertId; // Use `insertId` from the insert operation
                    if (!teamID) {
                        return reject(new Error('Failed to retrieve Team ID after creation.'));
                    }
                    resolve(teamID); // Resolve with the TeamID
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },

    deleteTeam: (TeamID, GroupID) => {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM Evaluation_Teams 
                WHERE TeamID = ? AND GroupID = ?
            `;
            db.execute(query, [TeamID, GroupID])
                .then(([result]) => {
                    if (result.affectedRows === 0) {
                        return reject(new Error('No team found with provided IDs.'));
                    }
                    resolve(result);
                })
                .catch(err => {
                    console.error('Database query error:', err);
                    reject(err);
                });
        });
    },
    getTeamName: (groupID, teamID) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT TeamName
                FROM Evaluation_Teams
                WHERE GroupID = ? AND TeamID = ?
            `;
            console.log("Executing query with groupID:", groupID, "teamID:", teamID);
    
            db.execute(query, [groupID, teamID])
                .then(([results]) => {
                    // Log raw results from the database
                    console.log("Raw query results from DB:", results);
    
                    if (results.length > 0) {
                        console.log("Team name fetched from DB:", results[0].TeamName);
                        resolve(results[0].TeamName);
                    } else {
                        console.log("No matching team found in DB for groupID:", groupID, "teamID:", teamID);
                        resolve(null);
                    }
                })
                .catch(err => {
                    console.error("Database query error:", err);
                    reject(err);
                });
        });
    },    

    updateTeamName: (TeamID, TeamName) => {
        return new Promise((resolve, reject) => {
            const updateQuery = `
                UPDATE Evaluation_Teams 
                SET TeamName = ? 
                WHERE TeamID = ?
            `;

            const checkQuery = `
                SELECT TeamID 
                FROM Evaluation_Teams 
                WHERE TeamID = ?
            `;

            // Check if the team exists
            db.execute(checkQuery, [TeamID])
                .then(([results]) => {
                    if (results.length === 0) {
                        throw new Error("Team not found");
                    }
                    // Proceed with the update
                    return db.execute(updateQuery, [TeamName, TeamID]);
                })
                .then(() => {
                    resolve({ message: "Team name updated successfully" });
                })
                .catch(err => {
                    console.error("Database query error:", err);
                    reject(err);
                });
        });
    },

};
