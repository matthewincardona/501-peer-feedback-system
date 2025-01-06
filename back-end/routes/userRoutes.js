const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// keep me on the top please!
// http://localhost:1000/users/searchUser?email=user@rit.edu
router.get("/searchUser", userController.searchUser);

// http://localhost:1000/users/all
router.get("/all", userController.getAllUsers);

// http://localhost:1000/users/getCreatorPermissions?CreatorID=2&GroupID=1
router.get("/getCreatorPermissions", userController.getCreatorPermissions);

// http://localhost:1000/users/:groupId
router.get("/:groupId", userController.getUsersByGroupID);

// http://localhost:1000/users/username/:username
router.get("/username/:username", userController.getUserByUsername);

// http://localhost:1000/users/getCreators/:groupID
router.get("/getCreators/:groupID", userController.getCreators);

// http://localhost:1000/users/getCreators/:groupID
router.get("/getResponders/:groupID", userController.getResponders);

// http://localhost:1000/users/setCreatorPermissions
router.put("/setCreatorPermissions", userController.setCreatorPermissions)

// http://localhost:1000/users/addUser
router.post("/addUser", userController.addUser);

// http://localhost:1000/users/setCreator/:groupID
router.post("/setCreator/:groupID", userController.setCreator);

// http://localhost:1000/users/getResponder/:groupID
router.post("/setResponder/:groupID", userController.setResponder);

// http://localhost:1000/users/:username
router.delete("/:username", userController.deleteUser);

//http://localhost:1000/users/reviewer/(reviewer id)
router.get('/reviewer/:reviewerID', userController.getUserByReviewerID);

// http://localhost:1000/users/deleteFromGroup/:groupID/:userID
router.delete("/deleteFromGroup/:groupID/:userID", userController.deleteUserFromGroup);

// http://localhost:1000/getUserById/:UserID
router.post("/access-level", userController.updateUserAccessLevel);

// URL: http://localhost:1000/users/:userId
router.get("/users/:userId", userController.getUserById);

module.exports = router;
