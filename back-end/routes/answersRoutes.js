const express = require('express');
const router = express.Router();

const answersController = require("../controllers/answersController");

//http://localhost:1000/answers/responses/form?formID=1&userID=1
router.get("/responses/form", answersController.getResponsesFromUser);

//http://localhost:1000/answers/getuserevaluations/?formID=1&userID=1
router.get("/getuserevaluations", answersController.getEvaluationsOfUser);

//http://localhost:1000/assignments/incomplete?formID=2&reviewerID=1
router.get("/incomplete", answersController.checkIncompleteAssignments);

//http://localhost:1000/answers/responses/number?formID=2
router.get("/responses/number", answersController.getNumberOfResponses);

//http://localhost:1000/answers/insert
router.post("/insert", answersController.insertResponses);

//http://localhost:1000/answers/getAllAnswersByForm
router.post("/getAllAnswersByForm", answersController.getAllAnswersFromForm);

module.exports = router;