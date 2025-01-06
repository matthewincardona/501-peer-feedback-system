const groupModel = require("../models/groupModel");

module.exports = {
    getCreators: async (req, res) => {
        const { GroupId } = req.query;
        try {
            const result = await groupModel.getCreators(GroupId);
            res.status(200).json(result);
        } catch (err) {
            console.log("Error in createGroup controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getGroupsByFormId: async (req, res) => {
        const formId = req.params.formId;
        try {
            const groups = await groupModel.getGroupsByFormId(formId);
            res.status(200).json(groups);
        } catch (err) {
            console.log("Error in getGroupsByFormId controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getGroupNameByGroupID: async (req, res) => {
        const groupID = req.params.groupID;
        try {
            const groupName = await groupModel.getGroupNameByGroupID(groupID);
            res.status(200).json({ GroupName: groupName });
        } catch (err) {
            console.log("Error in getGroupNameByGroupID controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createGroup: async (req, res) => {
        const { GroupName, CreatorID } = req.body;
        try {
            const GroupID = await groupModel.createGroup(GroupName, CreatorID); // Get the GroupID from the model
            res.status(200).json({ message: 'Created New Group', GroupID }); // Send GroupID in the response
        } catch (err) {
            console.log("Error in createGroup controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateGroup: async (req, res) => {
        const { GroupID, GroupName } = req.body;
        try {
            const result = await groupModel.updateGroup(GroupID, GroupName); // Call the model function
            res.status(200).json(result); // Respond with success message
        } catch (err) {
            console.log("Error in updateGroup controller:", err.message);
            if (err.message === "Group not found") {
                res.status(404).json({ error: "Group not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    },

    getGroupIdByFormId: async (req, res) => {
        const { FormID } = req.params;
        try {
            const GroupID = await groupModel.getGroupIdByFormId(FormID); // Call the model
            res.status(200).json({ GroupID }); // Send the GroupID in the response
        } catch (err) {
            console.log("Error in getGroupIdByFormId controller:", err.message);
            if (err.message === "Form not found") {
                res.status(404).json({ error: "Form not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    },

    updateGroupName: async (req, res) => {
        const { GroupID, GroupName } = req.body;
        try {
            const result = await groupModel.updateGroupName(GroupID, GroupName); // Call the model
            res.status(200).json(result); // Respond with success message
        } catch (err) {
            console.log("Error in updateGroupName controller:", err.message);
            if (err.message === "Group not found") {
                res.status(404).json({ error: "Group not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
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

}