// controllers/formController.js
const formModel = require("../models/formModel");

module.exports = {
    getFormsByUserID: async (req, res) => {
        const userId = req.params.userId;
        console.log(`Received request for user ID: ${userId}`); // Debug log
        try {
            const forms = await formModel.getFormsByUserId(userId);
            res.status(200).json(forms);
        } catch (err) {
            console.log("Error in getFormsByUserID controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getFormsByCreatorID: async (req, res) => {
        const creatorId = req.params.creatorId;
        console.log(`Received request for creator ID: ${creatorId}`); // Debug log
        try {
            const forms = await formModel.getFormsByCreatorId(creatorId);
            res.status(200).json(forms);
        } catch (err) {
            console.log("Error in getFormsByCreatorID controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    insertForm: async (req, res) => {
        console.log('Received data for insertion:', req.body);
        const { FormName, CreatorID, GroupID, Assigned, Deadline, QuestionList } = req.body;

        // Basic validation
        if (!FormName || !CreatorID || !GroupID || !Assigned || !Deadline || !Array.isArray(QuestionList)) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        console.log('Request body:', req.body);

        try {
            const result = await formModel.insertForm(FormName, CreatorID, GroupID, Assigned, Deadline, QuestionList);
            res.status(201).json({ message: 'Form inserted successfully', result });
        } catch (error) {
            console.error('Error inserting form:', error.message); // Log detailed error
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    updateForm: async (req, res) => {
        const {formName, Assigned, Deadline, QuestionList, formID } = req.body;
        try {
            // Pass all the necessary parameters to formModel.updateForm
            const result = await formModel.updateForm(formName, Assigned, Deadline, QuestionList, formID );
            res.status(201).json(result);
        } catch (error) {
            console.log("Error updating form:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    ,
    getFormByID: async (req, res) => {
        const formID = req.params.formID;

        try {
            const result = await formModel.getFormByID(formID);
            res.status(200).json({ result })
        } catch (error) {
            console.error('Error getting form by id:', error.message); // Log detailed error
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteForm: async (req, res) => {
        const { formID } = req.body;
        try {
            const result = await formModel.deleteForm(formID);
            res.status(200).json({ message: 'Form deleted sucessfully' });
        } catch (error) {
            console.log("Error deleting form:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getEditForm: async (req, res) => {
        const { groupId, userId } = req.params; // Expecting groupId and userId in the request params

        try {
            const groupDetails = await formModel.getEditForm(groupId, userId);
            res.status(200).json(groupDetails);  // Return the group details
        } catch (err) {
            console.error("Error fetching group details for editing:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Set the updated details for the form (group name, creator permissions, assigned, deadline, etc.)
    setEditForm: async (req, res) => {
        const { groupId, userId, formName, assigned, deadline } = req.body;

        try {
            const result = await formModel.setEditForm(groupId, userId, formName, assigned, deadline);
            res.status(200).json({ message: 'Form updated successfully', result });
        } catch (error) {
            console.error('Error updating form:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getAssignedDate: async (req, res) => {
        const { formID } = req.params;  // Expecting formID in the request params

        console.log(`Received request for assigned date of form ID: ${formID}`); // Debug log

        try {
            const form = await formModel.getAssignedDate(formID);
            if (form) {
                res.status(200).json({ assigned: form.Assigned });
            } else {
                res.status(404).json({ message: 'Form not found' });
            }
        } catch (err) {
            console.log("Error in getAssignedDate controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get the deadline date for a particular form
    getDeadlineDate: async (req, res) => {
        const { formID } = req.params;  // Expecting formID in the request params

        console.log(`Received request for deadline date of form ID: ${formID}`); // Debug log

        try {
            const form = await formModel.getDeadlineDate(formID);
            if (form) {
                res.status(200).json({ deadline: form.Deadline });
            } else {
                res.status(404).json({ message: 'Form not found' });
            }
        } catch (err) {
            console.log("Error in getDeadlineDate controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    markFormAsCompleted: async (req, res) => {
        const { userID, formID } = req.body;

        try {
            const result = await formModel.markFormAsCompleted(userID, formID);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in controller:', error);
            res.status(500).json({ error: 'An error occurred while marking the form as completed.' });
        }
    }
}