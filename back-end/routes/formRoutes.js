const express = require('express');
const router = express.Router();

const formController = require('../controllers/formController');

// http://localhost:1000/forms/user/{userID}
router.get("/user/:userId", formController.getFormsByUserID);

// http://localhost:1000/forms/creator/{creatorIDHERE}
router.get("/creator/:creatorId", formController.getFormsByCreatorID);  

// http://localhost:1000/forms/insert
router.post("/insert", formController.insertForm);

// http://localhost:1000/forms/id/{formIDHERE}
router.get('/id/:formID', formController.getFormByID);

// http://localhost:1000/forms/updateForm
router.put('/updateForm', formController.updateForm);

// http://localhost:1000/forms/delete
router.delete('/delete', formController.deleteForm)

router.get('/edit/:groupId/:userId', formController.getEditForm);
router.put('/edit/', formController.setEditForm);
router.get('/:formID/assigned', formController.getAssignedDate);
router.get('/:formID/deadline', formController.getDeadlineDate);

// http://localhost:1000/forms/delete
router.post('/markFormAsCompleted', formController.markFormAsCompleted);

module.exports = router;