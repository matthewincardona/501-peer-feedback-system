import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPenToSquare,
  faTrashCan,
  faPaperPlane,
  faEye,
  faCheckCircle,
  faClock,
  faTimesCircle // Import the rejection symbol icon
} from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from 'react-router-dom';
import "./FormCard.css";

function FormCard({ formData, isMyForm, isCompleted, onDelete, currentUserID }) {
  const navigate = useNavigate();
  const [groupID, setGroupID] = useState(null); // Store the GroupID fetched
  const [permissions, setPermissions] = useState(null); // Store permissions
  const [fetchError, setFetchError] = useState(null); // Store fetch errors
  const formID = formData.FormID;

  // Fetch GroupID
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`http://localhost:1000/groups/${formID}`);
        const data = await response.json();
        if (data.length > 0 && data[0].GroupID) {
          setGroupID(data[0].GroupID); // Set the first group's ID (adjust if multiple groups are relevant)
        } else {
          console.warn(`No groupID found for Form ID ${formID}`);
        }
      } catch (error) {
        console.error(`Error fetching groups for Form ID ${formID}:`, error);
      }
    };

    fetchGroupData();
  }, [formID]);


  // Fetch Creator Permissions once GroupID is available
  useEffect(() => {
    const fetchCreatorPermissions = async () => {
      if (!groupID || !currentUserID) return;

      try {
        const response = await fetch(
          `http://localhost:1000/users/getCreatorPermissions?CreatorID=${currentUserID}&GroupID=${groupID}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch permissions for CreatorID ${currentUserID} and GroupID ${groupID}`
          );
        }
        const data = await response.json();
        // console.log('Fetched Permissions:', data); // Log the fetched data

        // Extract the inner `permissions` object
        setPermissions(data.permissions);
      } catch (error) {
        console.error(
          `Error fetching permissions for CreatorID ${currentUserID} and GroupID ${groupID}:`,
          error
        );
        setFetchError(error.message); // Store error message in state
      }
    };

    fetchCreatorPermissions();
  }, [groupID, currentUserID]);

  // Check if assigned date has passed
  const isAssignedDatePassed = () => {
    const assignedDate = new Date(formData.Assigned);
    const currentDate = new Date();
    return currentDate >= assignedDate;
  };

  // Check if the deadline has passed
  const isDeadlinePassed = () => {
    const deadlineDate = new Date(formData.Deadline);
    const currentDate = new Date();
    return currentDate > deadlineDate;
  };

  const handleViewGroupsClick = () => {
    clearViewGroupLocalStorage();
    localStorage.setItem('selectedFormID', formID);
    navigate('/groups');
  };

  const clearViewGroupLocalStorage = () => {
    ['groupName', 'selectedFormID', 'selectedGroupID', 'selectedUserID', 'teams'].forEach(key =>
      localStorage.removeItem(key)
    );
  };

  const handleCompleteFormClick = () => {
    if (!isCompleted && isAssignedDatePassed()) {
      navigate('reform', { state: { formID } });
    }
  };

  const handleViewResultsClick = () => {
    navigate('results', { state: { formID } });
  };

  const handleEditFormClick = () => {
    // // console.log(formID);
    // navigate('editform', { state: { formID } });
    navigate('editgroup', { state: { formID } });
  };

  const handleDeleteFormClick = () => {
    onDelete(formID); // Call the onDelete function passed from the parent
  };

  const renderEditButtons = () => {
    return (
      <>
        {permissions?.canViewGroup && (
          <div className="formCard__toolbar-action" onClick={handleViewGroupsClick}>
            <FontAwesomeIcon icon={faUser} size="lg" />
            <p className="sub">View Groups</p>
          </div>
        )}
        {!isAssignedDatePassed() && permissions?.canEditForm && (
          <div className="formCard__toolbar-action" onClick={handleEditFormClick}>
            <FontAwesomeIcon icon={faPenToSquare} size="lg" />
            <p className="sub">Edit Form</p>
          </div>
        )}
        {permissions?.canDeleteForm && (
          <div className="formCard__toolbar-action" onClick={handleDeleteFormClick}>
            <FontAwesomeIcon icon={faTrashCan} size="lg" />
            <p className="sub">Delete</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className={`formCard${isMyForm ? "" : " formCard--not-editable"} ${!isMyForm && (isCompleted || isDeadlinePassed()) ? " formCard--completed" : ""}`}
    >
      <div className="formCard__top">
        <div className="formCard__top__due-date">
          <p>Due {formData.Deadline}</p>
        </div>
        <h4>{formData.FormName}</h4>
        <p>Available starting <strong>{new Date(formData.Assigned).toLocaleDateString()}</strong> at <strong>12am.</strong></p>
      </div>

      <div className="formCard__toolbar">
        {isMyForm ? (
          <>
            {permissions?.canSeeResponses && (
              <div className="formCard__toolbar-action" onClick={handleViewResultsClick}>
                <FontAwesomeIcon icon={faEye} size="lg" />
                <p className="sub">View Data</p>
              </div>
            )}
            {renderEditButtons()}
          </>
        ) : (
          <div
            className={`formCard__toolbar-action ${isCompleted || isDeadlinePassed() ? "formCard__toolbar-action--disabled" : ""}`}
            onClick={!isCompleted && !isDeadlinePassed() && isAssignedDatePassed() ? handleCompleteFormClick : undefined}
            style={isCompleted || !isAssignedDatePassed() || isDeadlinePassed() ? { pointerEvents: "none", cursor: "default" } : {}}
          >
            <FontAwesomeIcon
              icon={isCompleted ? faCheckCircle : isDeadlinePassed() ? faTimesCircle : !isAssignedDatePassed() ? faClock : faPaperPlane}
              size="lg"
            />
            <p className="sub">
              {isCompleted
                ? "Completed"
                : isDeadlinePassed()
                  ? "Passed Deadline"
                  : !isAssignedDatePassed()
                    ? "Not Yet Available"
                    : "Complete Form"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormCard;
