const express = require('express');
const router = express.Router();

const groupController = require("../controllers/groupController");

//http://localhost:1000/groups/getCreators?GroupId=2
router.get("/getCreators", groupController.getCreators)

//http://localhost:1000/groups/(form id)
router.get("/:formId", groupController.getGroupsByFormId);

// http://localhost:1000/groups/groupname/:groupID
router.get("/groupname/:groupID", groupController.getGroupNameByGroupID);

//http://localhost:1000/groups/createGroup
router.post("/createGroup", groupController.createGroup);

// http://localhost:1000/groups/updateGroup
router.post("/updateGroup", groupController.updateGroup);

// http://localhost:1000/groups/getGroupIdByFormId/:FormID
router.get("/getGroupIdByFormId/:FormID", groupController.getGroupIdByFormId);

// http://localhost:1000/groups/updateGroupName
router.post("/updateGroupName", groupController.updateGroupName);

//http://localhost:1000/groups/createGroup
// router.post("/addUser", groupController.addUser);

module.exports = router;