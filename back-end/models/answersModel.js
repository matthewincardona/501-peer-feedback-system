const db = require('../services/connectToDB');

module.exports = {

  getResponsesFromUser: (userID, formID) => {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT ua.UserID AS Reviewer, 
                   CONCAT(reviewer.FirstName, ' ', reviewer.LastName) AS ReviewerFullName,
                   ua.ReviewedID AS Reviewee, 
                   CONCAT(reviewee.FirstName, ' ', reviewee.LastName) AS RevieweeFullName,
                   ua.Answers
            FROM User_Answers ua
            LEFT JOIN User reviewer ON ua.UserID = reviewer.UserID
            LEFT JOIN User reviewee ON ua.ReviewedID = reviewee.UserID
            WHERE ua.UserID = ? AND ua.FormID = ?
        `;

      db.execute(query, [userID, formID])
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

  getEvaluationsOfUser: (userID, formID) => {
    return new Promise(async (resolve, reject) => {
      const query = `
            SELECT ua.UserID AS Reviewer, 
                   CONCAT(reviewer.FirstName, ' ', reviewer.LastName) AS ReviewerFullName,
                   ua.ReviewedID AS Reviewee, 
                   CONCAT(reviewee.FirstName, ' ', reviewee.LastName) AS RevieweeFullName,
                   ua.Answers
            FROM User_Answers ua
            LEFT JOIN User reviewer ON ua.UserID = reviewer.UserID
            LEFT JOIN User reviewee ON ua.ReviewedID = reviewee.UserID
            WHERE ua.ReviewedID = ? AND ua.FormID = ?
        `;

      try {
        // Execute the query with userID and formID as parameters
        const [results] = await db.execute(query, [userID, formID]);
        console.log('Query results:', results); // Log the query results

        // Check if results are available and resolve them
        if (results.length > 0) {
          resolve(results);
        } else {
          resolve([]); // Resolve with an empty array if no results are found
        }
      } catch (err) {
        console.error('Database query error:', err); // Log the error
        reject(err); // Reject with the error
      }
    });
  },

  getNumberOfResponses: (formID) => {
    return new Promise(async (resolve, reject) => {
      const query = `
          SELECT COUNT(DISTINCT id) AS totalneeded, Count(DISTINCT AnswersID) AS currentnumber FROM user_list ul
	          JOIN Evaluation_Group eg on ul.GroupID = eg.GroupID
              JOIN Form ef on ef.GroupID = eg.GroupID
                LEFT JOIN User_Answers ua on ef.FormID = ua.FormID
                  WHERE ua.FormID = ?`;


      const results = await db.execute(query, [formID])
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

  insertResponses: (UserID, ReviewedID, FormID, Answers) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO User_Answers (UserID, ReviewedID, FormID, Submission, Submitted, Answers) 
                     VALUES (?, ?, ?, NOW(), 1, ?)`;
      console.log('Executing Insert Query:', query);
      console.log('With Values:', [UserID, ReviewedID, FormID, Answers]);

      db.execute(query, [UserID, ReviewedID, FormID, Answers])
        .then(([result]) => {
          console.log('Insert Successful:', result);
          resolve(result);
        })
        .catch(err => {
          console.error('Error Inserting Responses:', err);
          reject(err);
        });
    });
  },

  getAssignmentsForReviewer: (formID, reviewerID) => {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT 
                tu.UserID AS Reviewee,
                CONCAT(u.FirstName, ' ', u.LastName) AS RevieweeName
            FROM 
                Team_User_List tu
            JOIN 
                Evaluation_Teams et ON tu.TeamID = et.TeamID
            JOIN 
                User u ON tu.UserID = u.UserID
            JOIN 
                Form f ON f.GroupID = et.GroupID AND f.FormID = ?
            JOIN 
                User_List ul ON ul.GroupID = et.GroupID AND ul.UserID = ?
            JOIN 
                Team_User_List tulr ON tulr.UserID = ? AND tulr.TeamID = et.TeamID
            LEFT JOIN 
                User_Answers ua ON ua.UserID = ? 
                    AND ua.ReviewedID = tu.UserID 
                    AND ua.FormID = ?
                    AND ua.Submitted = TRUE
            WHERE 
                tu.UserID != ul.UserID 
                AND ul.UserPermission = 'Responder'
                AND (ua.UserID IS NULL OR ua.Submitted = FALSE);
        `;

      // Updated parameters
      db.execute(query, [formID, reviewerID, reviewerID, reviewerID, formID])
        .then(([results]) => {
          console.log('Filtered incomplete assignments:', results);
          resolve(results);
        })
        .catch(err => {
          console.error('Database query error:', err);
          reject(err);
        });
    });
  },

  checkSubmissionExists: (reviewerID, revieweeID, formID) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COUNT(*) AS submissionCount
        FROM user_answers
        WHERE UserID = ? AND ReviewedID = ? AND FormID = ? AND Submitted = TRUE;
      `;

      db.execute(query, [reviewerID, revieweeID, formID])
        .then(([results]) => {
          // Check if there's a submission count greater than 0
          const submissionExists = results[0].submissionCount > 0;
          resolve(submissionExists);
        })
        .catch(err => {
          console.error('Database query error:', err);
          reject(err);
        });
    });
  },

  getAllAnswersFromForm: (formID) => {
    return new Promise(async (resolve, reject) => {
      const query = `
            SELECT 
                et.TeamName AS Team, 
                CONCAT(reviewer.Firstname, ' ', reviewer.LastName) AS Reviewer, 
                CONCAT(reviewee.Firstname, ' ', reviewee.LastName) AS Reviewee, 
                ua.answers AS Answers 
            FROM 
                User_Answers ua
            JOIN 
                User reviewer ON ua.UserID = reviewer.UserID
            JOIN 
                User reviewee ON ua.ReviewedID = reviewee.UserID
            JOIN 
                Form f ON ua.FormID = f.FormID
            JOIN 
                Evaluation_Group eg ON f.GroupID = eg.GroupID
            JOIN 
                Evaluation_Teams et ON et.GroupID = eg.GroupID
            JOIN 
                Team_User_List tul ON tul.TeamID = et.TeamID AND tul.UserID = ua.UserID
            WHERE 
                f.FormID = ?;
        `;
      db.execute(query, [formID])
        .then(([results]) => {
          resolve(results);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}