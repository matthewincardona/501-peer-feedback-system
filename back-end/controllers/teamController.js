const teamModel = require("../models/teamModel");

module.exports = {
    getTeamsByGroupID: async (req, res) => {
        const groupId = req.params.groupId;
        try {
            const teams = await teamModel.getTeamsByGroupId(groupId);
            res.status(200).json(teams);
        } catch (err) {
            console.log("Error in getTeamsByGroupID controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUsersInTeam: async (req, res) => {
        const teamID = req.query.teamID;
        try {
            const users = await teamModel.getUsersInTeam(teamID);
            console.log('Users fetched:', users); // Debugging line
            res.status(200).json(users);
        } catch (err) {
            console.log("Error in getUsersInTeam controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createTeam: async (req, res) => {
        const { GroupID, TeamName } = req.body;

        if (!GroupID || !TeamName) {
            return res.status(400).json({ error: 'GroupID and TeamName are required.' });
        }

        try {
            const teamID = await teamModel.createTeam(GroupID, TeamName);
            res.status(201).json({ message: "Created Team Successfully", TeamID: teamID });
        } catch (error) {
            console.error('Error creating team:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteTeam: async (req, res) => {
        const teamId = req.params.teamId;
        const groupId = req.params.groupId;

        if (!teamId || !groupId) {
            return res.status(400).json({ error: 'Both Team ID and Group ID are required.' });
        }

        try {
            const result = await teamModel.deleteTeam(teamId, groupId);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Team not found or already deleted.' });
            }
            res.status(200).json({ message: "Team deleted successfully" });
        } catch (error) {
            console.error("Error in deleteTeam controller:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getTeamName: async (req, res) => {
        const { groupID, teamID } = req.query;
    
        if (!groupID || !teamID) {
            return res.status(400).json({ error: 'GroupID and TeamID are required.' });
        }
    
        try {
            const teamName = await teamModel.getTeamName(groupID, teamID);
            if (teamName) {
                res.status(200).json({ TeamName: teamName });
            } else {
                res.status(404).json({ error: 'Team not found.' });
            }
        } catch (err) {
            console.error("Error in getTeamName controller:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
      

    updateTeamName: async (req, res) => {
        const { TeamID, TeamName } = req.body;
        try {
            const result = await teamModel.updateTeamName(TeamID, TeamName); // Call the model
            res.status(200).json(result); // Respond with success message
        } catch (err) {
            console.log("Error in updateTeamName controller:", err.message);
            if (err.message === "Team not found") {
                res.status(404).json({ error: "Team not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    },

};
