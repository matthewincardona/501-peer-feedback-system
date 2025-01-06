const express = require('express');
const router = express.Router();

const teamController = require("../controllers/teamController");

// http://localhost:1000/teams/teamName?groupID=1&teamID=2
router.get("/teamName", teamController.getTeamName);

//http://localhost:1000/teams/users?teamID=2
router.get("/users", teamController.getUsersInTeam);

// http://localhost:1000/teams/groupid
router.get("/:groupId", teamController.getTeamsByGroupID);

// Create a new team
router.post("/createTeam", teamController.createTeam);

// Delete a team by ID
router.delete("/deleteTeam/:teamId/:groupId", teamController.deleteTeam); // Route for deleting a team

// http://localhost:1000/teams/updateTeamName
router.post("/updateTeamName", teamController.updateTeamName);

module.exports = router;
