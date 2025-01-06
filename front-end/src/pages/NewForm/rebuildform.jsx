import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import "survey-core/defaultV2.min.css";
import "survey-core/survey.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { getUserProfile } from "../../utils/getUserProfile";
import NavigationHeader from '../../components/ui/NavigationHeader';
import ResponderDropdown from '../../components/ui/ResponderDropdown';
import './form.css';

function RebuildForm() {
  const location = useLocation();
  const { formID } = location.state || {};
  // console.log("FormID", formID);
  const [surveyModel, setSurveyModel] = useState(null);
  const [retryComplete, setRetryComplete] = useState(false); // Tracks when retries are done
  const [loading, setLoading] = useState(false); // Loading state
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentID, setSelectedAssignmentID] = useState(null);
  var reviewerID;

  useEffect(() => {
    const getUsername = async () => {
      try {
        const userProfile = await getUserProfile();
        if (userProfile) {
          console.log(userProfile.UserName);

          // Call getUserInfo after setting username
          await getUserInfo(userProfile.UserName);
        } else {
          console.error('Failed to load user profile.');
          alert('Unable to load user profile. Please check your connection.');
        }
      } catch (error) {
        console.error('Error finding user:', error);
      }
    };

    const getUserInfo = async (username) => {
      try {
        const response = await fetch(`http://localhost:1000/users/username/${username}`);
        if (!response.ok) throw new Error(`Failed to fetch user info: ${response.statusText}`);
        const userData = await response.json();
        reviewerID = userData.UserID;
        // console.log("UserID", reviewerID);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    getUsername();
  }, []);

  const markFormAsCompleted = async () => {
    try {
      const response = await fetch('http://localhost:1000/forms/markFormAsCompleted', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: reviewerID, // Ensure reviewerID is set
          formID: formID, // Use the current formID
        }),
      });
      const data = await response.json();
      // console.log('Form completion status:', data);
    } catch (error) {
      console.error('Error marking form as completed:', error);
    }
  };

  let retryCount = 0;
  const fetchData = async (retry = false) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`http://localhost:1000/forms/id/${formID}`);
      if (!response.ok) throw new Error(`Failed to fetch form data: ${response.statusText}`);
      const formData = await response.json();

      const questions = formData.result[0].QuestionList.map(question => {
        switch (question.type) {
          case "Short Answer":
            return {
              type: "text",
              name: question.text,
              title: question.title || question.text,
              isRequired: true // Make question required
            };
          case "Long Answer":
            return {
              type: "comment",
              name: question.text,
              title: question.title || question.text,
              isRequired: true // Make question required
            };
          case "Description":
            return {
              type: "html",
              name: question.text,
              html: question.description || question.text,
              // Descriptions are typically informational, so no need for isRequired here
            };
          case "Rating Scale":
            return {
              type: "rating",
              name: question.text,
              title: question.title || question.text,
              rateMin: question.ratingScale?.start || 1,
              rateMax: question.ratingScale?.end || 5,
              isRequired: true // Make question required
            };
          default:
            return null;
        }
      }).filter(Boolean);


      const surveyJson = { title: formData.result[0].FormName, questions: questions };
      const survey = new Model(surveyJson);

      survey.onComplete.add((sender) => {
        const answers = sender.data;
        handleSurveyCompletion(answers);
      });

      setSurveyModel(survey);

      const assignmentsResponse = await fetch(`http://localhost:1000/answers/incomplete?formID=${formID}&reviewerID=${reviewerID}`);
      if (!assignmentsResponse.ok) throw new Error(`Failed to fetch assignments: ${assignmentsResponse.statusText}`);
      const assignmentsData = await assignmentsResponse.json();

      if (assignmentsData.assignments.length === 0) {
        if (retryCount < 3) {
          retryCount++;
          // console.log(`No assignments found, retrying... (${retryCount}/5)`);
          setTimeout(() => fetchData(true), 200); // Retry after 1 second
        } else {
          // console.log("Max retries reached. Marking form as completed...");
          markFormAsCompleted();
          setRetryComplete(true); // Indicate retries are done
          setLoading(false); // Stop loading
        }
      } else {
        setAssignments(assignmentsData.assignments);
        setRetryComplete(true); // Indicate retries are done
        setLoading(false); // Stop loading
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(`Error fetching data: ${error.message}`);
      setRetryComplete(true); // Mark retries as done even on failure
      setLoading(false); // Stop loading on error
    }
  };

  useEffect(() => {
    fetchData();
  }, [formID, reviewerID]);

  // Define the ref for selectedAssignmentID
  const selectedAssignmentIDRef = useRef(null);

  const handleAssignmentSelect = (assignmentID) => {
    // console.log('Assignment selected:', assignmentID);
    setSelectedAssignmentID(assignmentID);
    selectedAssignmentIDRef.current = assignmentID;  // Keep the ref in sync
  };

  const handleSurveyCompletion = async (answers) => {
    if (!selectedAssignmentIDRef.current) {
      alert("Please select an assignment before submitting.");
      return;
    }
  
    const payload = {
      UserID: reviewerID,
      ReviewedID: selectedAssignmentIDRef.current,
      FormID: formID,
      Answers: JSON.stringify(answers),
    };
  
    try {
      const response = await fetch("http://localhost:1000/answers/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        setTimeout(() => {
          window.location.reload(); // Refresh the page after 5 seconds
        }, 500); // Delay in milliseconds (5000 ms = 5 seconds)
      } else {
        const errorData = await response.json();
        console.error("Failed to submit survey responses:", errorData.error);
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting survey responses:", error);
      alert("An error occurred during submission.");
    }
  };
  
  

  return (
    <main>
      <NavigationHeader />
      {loading ? (
        <div className="loading">
          <p>Loading assignments, please wait...</p>
        </div>
      ) : retryComplete && assignments.length === 0 ? (
        <div className="no-assignments">
          <p>No pending assignments to review.</p>
        </div>
      ) : (
        <>
          {assignments.length > 0 && (
            <>
              <ResponderDropdown
                assignments={assignments}
                selectedAssignmentID={selectedAssignmentID}
                onAssignmentSelect={handleAssignmentSelect}
              />
              {selectedAssignmentID && surveyModel && (
                <div className="rebuildForm__surveyContainer">
                  <Survey model={surveyModel} />
                </div>
              )}
            </>
          )}
        </>
      )}
    </main>

  );
}

export default RebuildForm;

