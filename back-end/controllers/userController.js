const userModel = require("../models/userModel");

module.exports = {


    getUsersByGroupID: async (req, res) => {
        const groupId = req.params.groupId;
        try {
            const users = await userModel.getUsersByGroupId(groupId);
            res.status(200).json(users);
        } catch (err) {
            console.log("Error in getUsersByGroupId controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    addUser: async (req, res) => {
        try {
            const userData = {
                userName: req.body.userName,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                accessLevel: req.body.accessLevel
            };
            const newUser = await userModel.addUser(userData);
            res.status(201).json(newUser);
        } catch (err) {
            console.log("Error in addUser controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteUser: async (req, res) => {
        const username = req.params.username;
        try {
            await userModel.deleteUser(username);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            console.log("Error in deleteUser controller:", err);
            if (err.message === 'User not found') {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    },

    getUserByUsername: async (req, res) => {
        const username = req.params.username;
        try {
            const user = await userModel.getUserByUsername(username);
            res.status(200).json(user);
        } catch (err) {
            console.log("Error in getUserByUsername controller:", err);
            if (err.message === 'User not found') {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    },

    getUserByReviewerID: async (req, res) => {
        const { reviewerID } = req.params;
        try {
            const user = await userModel.getUserByReviewerID(reviewerID);
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user by reviewer ID:', error);
            res.status(500).json({ message: error.message });
        }
    },

    setCreator: async (req, res) => {
        const groupID = req.params.groupID; // Expecting groupId in the route
        const userID = req.body.userID; // Expecting creatorId in the body
        const creatorPermissions = req.body.creatorPermissions; // Expecting permissions in the body

        console.log("Group ID:", groupID)
        console.log("User ID:", userID)
        console.log("Permissions:", creatorPermissions)

        try {
            const newCreator = await userModel.setCreator(groupID, userID, creatorPermissions);
            res.status(201).json(newCreator);
        } catch (err) {
            console.log("Error in setCreator controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    setResponder: async (req, res) => {
        const groupID = req.params.groupID; // Expecting groupId in the route
        const responderID = req.body.responderID; // Expecting responderId in the body
        const teamID = req.body.teamID; // Expecting responderId in the body

        try {
            const newResponder = await userModel.setResponder(groupID, responderID, teamID);
            res.status(201).json(newResponder);
        } catch (err) {
            console.log("Error in setResponder controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getCreatorPermissions: async (req, res) => {
        const { CreatorID, GroupID } = req.query;
        try {
            const result = await userModel.getCreatorPermissions(CreatorID, GroupID);
            console.log(result);
            res.status(200).json(result);
        } catch (err) {
            console.log("Error in getCreatorPermissions controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    setCreatorPermissions: async (req, res) => {
        const { Permissions, CreatorID, GroupID } = req.body;
        try {
            const result = await userModel.setCreatorPermissions(CreatorID, JSON.stringify(Permissions), GroupID);
            res.status(201).json({ message: 'Creator Permissions Updated Sucessfully' });
        } catch (err) {
            console.log("Error in getCreatorPermissions controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    searchUser: async (req, res) => {
        const email = req.query.email; // Ensure you're using the right property
        try {
            const user = await userModel.searchUser(email); // Fetch user data
            if (user) {
                console.log("User Found: ", user)
                res.status(200).json(user); // Return user object if found
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (err) {
            console.log("Error in search user controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getCreators: async (req, res) => {
        const { groupID } = req.params;
        try {
            const creators = await userModel.getCreators(groupID);
            res.status(200).json(creators);
        } catch (err) {
            console.error("Error in getCreators controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    getResponders: async (req, res) => {
        const { groupID } = req.params; // Extract groupID from request parameters
        try {
            const responders = await userModel.getResponders(groupID); // Call model function to fetch responders
            res.status(200).json(responders); // Send response with responders
        } catch (err) {
            console.error("Error in getResponders controller:", err);
            res.status(500).json({ error: 'Internal Server Error' }); // Handle errors gracefully
        }
    },    

    deleteUserFromGroup: async (req, res) => {
        const { groupID, userID } = req.params;

        try {
            await userModel.deleteUserFromGroup(groupID, userID); // Call the model method to delete user from group
            res.status(200).json({ message: 'User deleted from group successfully' });
        } catch (err) {
            console.log("Error in deleteUserFromGroup controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await userModel.getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            console.log("Error in getAllUsers controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateUserAccessLevel: async (req, res) => {
        const { userID, newAccessLevel } = req.body;

        // Validate input
        if (!userID || !newAccessLevel) {
            return res.status(400).json({ error: "userID and newAccessLevel are required." });
        }

        if (!['User', 'Creator', 'Admin'].includes(newAccessLevel)) {
            return res.status(400).json({ error: "Invalid access level. Must be 'User', 'Creator', or 'Admin'." });
        }

        try {
            const result = await userModel.updateUserAccessLevel(userID, newAccessLevel);
            res.status(200).json({ message: 'User access level updated successfully.', result });
        } catch (err) {
            console.error('Error in updateUserAccessLevel controller:', err.message);
            res.status(500).json({ error: err.message });
        }
    },

    getUserById: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await userModel.getUserById(userId); // Call the model to get user by ID
            if (user) {
                res.status(200).json({ username: user.UserName, fullName: user.FullName });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (err) {
            console.log("Error in getUserById controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


};