const answersModel = require('../models/answersModel');

module.exports = {
    getResponsesFromUser: async (req, res) => {
        const userID = req.query.userID;
        const formID = req.query.formID;
        try {
            const forms = await answersModel.getResponsesFromUser(userID, formID);
            res.status(200).json(forms);
        } catch (err) {
            console.log("Error in getResponsesFromUser controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getEvaluationsOfUser: async (req, res) => {
        const userID = req.query.userID;
        const formID = req.query.formID;
        try {
            const evals = await answersModel.getEvaluationsOfUser(userID, formID);
            res.status(200).json(evals);
        } catch (err) {
            console.log("Error in getEvaluationsOfUser controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    checkIncompleteAssignments: async (req, res) => {
        const formID = req.query.formID;
        const reviewerID = req.query.reviewerID;

        try {
            // Fetch only incomplete assignments for the reviewer in their team
            const incompleteAssignments = await answersModel.getAssignmentsForReviewer(formID, reviewerID);

            res.status(200).json({ assignments: incompleteAssignments });
        } catch (err) {
            console.log("Error in checkIncompleteAssignments controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getNumberOfResponses: async (req, res) => {
        const formID = req.query.formID;
        try {
            const results = await answersModel.getNumberOfResponses(formID);
            res.status(200).json(results);
        } catch (err) {
            console.log("Error in getNumberOfResponses controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    insertResponses: async (req, res) => {
        const { UserID, ReviewedID, FormID, Answers } = req.body;
        try {
            const results = await answersModel.insertResponses(UserID, ReviewedID, FormID, Answers);
            res.status(201).json(results);
        } catch (error) {
            console.log("Error in inserting responses:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getAllAnswersFromForm: async (req, res) => {
        const { formID } = req.body;
        try {
            const results = await answersModel.getAllAnswersFromForm(formID);
            res.status(200).json(results);
        } catch (error) {
            console.log("Error getting reposnces:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}