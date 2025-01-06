const db = require('../services/connectToDB');

module.exports = {

  getFormsByUserId: (userId) => {
    console.log(`Fetching forms for user ID: ${userId}`); // Debug log
    return new Promise((resolve, reject) => {
      const query = `
          SELECT f.FormID, f.FormName, f.Created, f.Assigned, f.Deadline, f.QuestionList, ul.FormCompleted
          FROM Form f
          JOIN Evaluation_Group eg ON f.GroupID = eg.GroupID
          JOIN User_List ul ON eg.GroupID = ul.GroupID
          WHERE ul.UserID = ? AND ul.UserPermission = 'Responder'
      `;
      db.execute(query, [userId])
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

  getFormsByCreatorId: (creatorId) => {
    console.log(`Fetching forms for creator ID: ${creatorId}`); // Debug log
    return new Promise((resolve, reject) => {
      const query = `
        SELECT f.FormID, f.FormName, f.Created, f.Assigned, f.Deadline, ul.FormCompleted
        FROM Form f
        LEFT JOIN User_List ul ON f.GroupID = ul.GroupID
        WHERE f.CreatorID = ?
      `;
      db.execute(query, [creatorId])
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

  insertForm: (FormName, CreatorID, GroupID, Assigned, Deadline, QuestionList) => {
    return new Promise((resolve, reject) => {

      const formattedQuestionList = JSON.stringify(QuestionList);
      const query = `INSERT INTO Form (FormName, CreatorID, GroupID, Created, Assigned, Deadline, QuestionList)
                            VALUES (?, ?, ?, NOW(), ?, ?, ?)`;

      console.log('Query:', query);
      console.log('Inserting with values:', [FormName, CreatorID, GroupID, Assigned, Deadline, formattedQuestionList]);

      db.execute(query, [FormName, CreatorID, GroupID, Assigned, Deadline, formattedQuestionList])
        .then(([result]) => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateForm: ( formName, Assigned, Deadline, QuestionList, formID) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE Form SET FormName=?, Assigned=?, Deadline=?, QuestionList=? WHERE formID=?';
      
      // Ensure the order of parameters matches the query
      db.execute(query, [formName, Assigned, Deadline, QuestionList,formID])
        .then(([result]) => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
,  

  getFormByID: (formID) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT FormName, CreatorId, GroupId, Assigned, Deadline, QuestionList FROM Form WHERE FormID = ?";

      db.execute(query, [formID])
        .then(([result]) => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  deleteForm: (formID) => {
    return new Promise((resolve, reject) => {
      const deleteUseranswers = 'DELETE FROM user_answers WHERE FormID = ?';
      const query = 'DELETE FROM Form Where formID = ?';

      db.execute(deleteUseranswers, [formID])
        .then(() => db.execute(query, [formID]))
        .then(([result]) => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  getEditForm: (groupId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT eg.GroupName, 
               et.TeamName, 
               ul.UserPermission AS CreatorPermission,
               ul.CreatorPermissions, 
               f.Assigned, f.Deadline, f.FormName, 
               u.UserName AS CreatorUserName
        FROM Evaluation_Group eg
        JOIN User_List ul ON eg.GroupID = ul.GroupID
        LEFT JOIN Evaluation_Teams et ON eg.GroupID = et.GroupID
        LEFT JOIN Form f ON eg.GroupID = f.GroupID
        LEFT JOIN User u ON eg.CreatorID = u.UserID
        WHERE eg.GroupID = ? AND ul.UserID = ?
      `;
      db.execute(query, [groupId, userId])
        .then(([results]) => {
          resolve(results);
        })
        .catch(err => {
          console.error('Database query error in getEditForm:', err);
          reject(err);
        });
    });
  },

  // Update the group details based on the new data (group name, teams, creators, etc.)
  setEditForm: (groupId, userId, formName, assigned, deadline) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE Form 
        SET FormName = ?, Assigned = ?, Deadline = ?
        WHERE GroupID = (
          SELECT GroupID
          FROM Evaluation_Group
          WHERE GroupID = ?
        ) AND CreatorID = (
          SELECT UserID 
          FROM User_List
          WHERE GroupID = ? AND UserID = ?
        )
      `;

      db.execute(query, [formName, assigned, deadline, groupId, groupId, userId])
        .then(([result]) => {
          resolve(result);
        })
        .catch(err => {
          console.error('Error updating form:', err);
          reject(err);
        });
    });
  },

  getAssignedDate: (formID) => {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT Assigned
            FROM Form
            WHERE FormID = ?
        `;
      db.execute(query, [formID])
        .then(([results]) => {
          if (results.length > 0) {
            resolve(results[0]); // Return the assigned date
          } else {
            resolve(null); // No form found with the given FormID
          }
        })
        .catch(err => {
          console.error('Database query error:', err);
          reject(err);
        });
    });
  },

  // Get the deadline date for a specific form by FormID
  getDeadlineDate: (formID) => {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT Deadline
            FROM Form
            WHERE FormID = ?
        `;
      db.execute(query, [formID])
        .then(([results]) => {
          if (results.length > 0) {
            resolve(results[0]); // Return the deadline date
          } else {
            resolve(null); // No form found with the given FormID
          }
        })
        .catch(err => {
          console.error('Database query error:', err);
          reject(err);
        });
    });
  },

  markFormAsCompleted: (userID, formID) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE User_List
        SET FormCompleted = TRUE
        WHERE UserID = ? AND GroupID = (SELECT GroupID FROM Form WHERE FormID = ?);
      `;

      db.execute(query, [userID, formID])
        .then(([result]) => {
          if (result.affectedRows > 0) {
            resolve({ message: 'Form marked as completed.' });
          } else {
            resolve({ message: 'No matching record found or already marked as completed.' });
          }
        })
        .catch(err => {
          console.error('Error marking form as completed:', err);
          reject(err);
        });
    });
  }
}