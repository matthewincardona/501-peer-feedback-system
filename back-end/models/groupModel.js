const db = require('../services/connectToDB');

module.exports = {
  getGroupsByFormId: (formId) => {
    console.log(`Fetching groups for form ID: ${formId}`); // Debug log
    return new Promise((resolve, reject) => {
      const query = `
            SELECT eg.GroupID, eg.GroupName
            FROM Evaluation_Group eg
            JOIN Form f ON eg.GroupID = f.GroupID
            WHERE f.FormID = ?
          `;
      db.execute(query, [formId]) // Use execute for parameterized query
        .then(([results]) => {
          console.log('Query results:', results); // Log results
          resolve(results);
        })
        .catch(err => {
          console.error('Database query error:', err);
          reject(err);
        });
    });
  },

  createGroup: (GroupName, CreatorID) => {
    return new Promise((resolve, reject) => {
      const insertQuery = `
            INSERT INTO Evaluation_Group (GroupName, Created, CreatorID) 
            VALUES (?, NOW(), ?)
        `;
      const selectQuery = `
            SELECT LAST_INSERT_ID() AS GroupID
        `;

      db.execute(insertQuery, [GroupName, CreatorID])
        .then(() => {
          // Now get the last inserted ID
          return db.execute(selectQuery);
        })
        .then(([results]) => {
          resolve(results[0].GroupID); // Resolve with the GroupID
        })
        .catch(err => {
          console.error('Database query error:', err);
          reject(err);
        });
    });
  },

  updateGroup: (GroupID, GroupName) => {
    return new Promise((resolve, reject) => {
      const updateQuery = `
            UPDATE Evaluation_Group 
            SET GroupName = ? 
            WHERE GroupID = ?
        `;
      const checkQuery = `
            SELECT GroupID 
            FROM Evaluation_Group 
            WHERE GroupID = ?
        `;

      // Check if the group exists
      db.execute(checkQuery, [GroupID])
        .then(([results]) => {
          if (results.length === 0) {
            throw new Error("Group not found");
          }
          // Proceed with the update
          return db.execute(updateQuery, [GroupName, GroupID]);
        })
        .then(() => {
          resolve({ message: "Group updated successfully" });
        })
        .catch(err => {
          console.error("Database query error:", err);
          reject(err);
        });
    });
  },

  getGroupIdByFormId: (FormID) => {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT GroupID 
            FROM Form 
            WHERE FormID = ?
        `;

      db.execute(query, [FormID])
        .then(([results]) => {
          if (results.length === 0) {
            throw new Error("Form not found");
          }
          resolve(results[0].GroupID); // Return the GroupID
        })
        .catch(err => {
          console.error("Database query error:", err);
          reject(err);
        });
    });
  },

  getGroupNameByGroupID: (groupID) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT GroupName
        FROM Evaluation_Group
        WHERE GroupID = ?
      `;
      db.execute(query, [groupID])
        .then(([results]) => {
          if (results.length > 0) {
            resolve(results[0].GroupName); // Return the group name
          } else {
            resolve(null); // Return null if no group found
          }
        })
        .catch(err => {
          console.error('Database query error:', err);
          reject(err);
        });
    });
  },

  updateGroupName: (GroupID, GroupName) => {
    return new Promise((resolve, reject) => {
      const updateQuery = `
            UPDATE Evaluation_Group 
            SET GroupName = ? 
            WHERE GroupID = ?
        `;

      const checkQuery = `
            SELECT GroupID 
            FROM Evaluation_Group 
            WHERE GroupID = ?
        `;

      // Check if the group exists
      db.execute(checkQuery, [GroupID])
        .then(([results]) => {
          if (results.length === 0) {
            throw new Error("Group not found");
          }
          // Proceed with the update
          return db.execute(updateQuery, [GroupName, GroupID]);
        })
        .then(() => {
          resolve({ message: "Group name updated successfully" });
        })
        .catch(err => {
          console.error("Database query error:", err);
          reject(err);
        });
    });
  },

  getCreators: (GroupId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT eg.CreatorId as CreatorId, u.FirstName as FirstName, u.LastName as LastName, ul.CreatorPermissions as Permissions
                       FROM Evaluation_Group eg
                       LEFT JOIN User_List ul ON ul.GroupID = eg.GroupID
                       LEFT JOIN User u ON eg.CreatorID = u.UserID
                       WHERE eg.GroupID = ? AND ul.CreatorPermissions IS NOT NULL`;
      db.execute(query, [GroupId])
        .then(([results]) => {
          resolve(results);
        })
        .catch(err => {
          console.error('Database query error:', err);
          reject(err);
        });
    });
  },
}
