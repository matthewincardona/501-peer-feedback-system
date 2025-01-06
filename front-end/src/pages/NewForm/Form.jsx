import React, { useState, useEffect } from "react";
import "survey-core/defaultV2.min.css";
import "survey-core/survey.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import './form.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ThankYouPage from "../../components/ui/ThankYouPage.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from 'dayjs';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  var creatorID;
  var { groupID } = location.state || {};

  // Retrieve startDate and endDate from location.state
  const startDate = dayjs(location.state?.startDate).format('YYYY-MM-DD');
  const endDate = dayjs(location.state?.endDate).format('YYYY-MM-DD');

  // Get CreatorID using GroupID
  const fetchCreatorID = async (groupID) => {
    try {
      const response = await fetch(`http://localhost:1000/groups/getCreators?GroupId=${groupID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch creator ID');
      }
      const data = await response.json();

      // Assuming the response contains an array of creators, get the first CreatorID
      if (data.length > 0) {
        creatorID = data[0].CreatorId;
      } else {
      }
    } catch (error) {
      console.error("Error fetching creator ID:", error);
    }
  };

  fetchCreatorID(groupID);
  console.log(creatorID);

  // Helper function to format date to MySQL-compatible format
  const formatDateToMySQL = (dateString, defaultHours = 0, defaultMinutes = 0, defaultSeconds = 0) => {
    // Use dayjs to parse and set the time directly
    const dt = dayjs(dateString)
      .hour(defaultHours)
      .minute(defaultMinutes)
      .second(defaultSeconds);

    return dt.format('YYYY-MM-DD HH:mm:ss'); // MySQL-compatible format
  };


  const surveyJson = {
    showQuestionNumbers: "off",
    completeText: "Preview",
    css: {
      root: "custom-survey",
      text: "custom-input",
      comment: "custom-input",
      dropdown: "custom-input",
    },
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "panel",
            name: "surveyInfo",
            elements: [
              {
                type: "text",
                name: "surveyTitle",
                title: "Survey Title",
                isRequired: true,
              },
              {
                type: "comment",
                name: "surveyDescription",
                title: "Survey Description (Optional)",
              },
            ],
          },
          {
            type: "paneldynamic",
            name: "dynamicQuestions",
            title: "Add Elements",
            templateElements: [
              {
                type: "dropdown",
                name: "questionType",
                title: "Elements Type",
                choices: ["Short Answer", "Long Answer", "Description", "Rating Scale"],
                isRequired: true,
              },
              {
                type: "text",
                name: "questionText",
                title: "Question Text",
                visibleIf: "{panel.questionType} = 'Short Answer' || {panel.questionType} = 'Long Answer'",
                isRequired: true,
              },
              {
                type: "text",
                name: "questionTitle",
                title: "Header (Optional)",
                visibleIf: "{panel.questionType} = 'Description'",
              },
              {
                type: "comment",
                name: "questionDescription",
                title: "Description",
                visibleIf: "{panel.questionType} = 'Description'",
                isRequired: true,
              },
              {
                type: "panel",
                name: "ratingScalePanel",
                title: "Rating Scale",
                visibleIf: "{panel.questionType} = 'Rating Scale'",
                elements: [
                  {
                    type: "text",
                    name: "ratingQuestionText",
                    title: "Question Text",
                    isRequired: true,
                  },
                  {
                    type: "text",
                    name: "ratingScaleStart",
                    title: "Start",
                    inputType: "number",
                    isRequired: true,
                    validators: [
                      {
                        type: "numeric",
                        minValue: 1,
                        maxValue: 20,
                        text: "Please enter a value between 1 and 20.",
                      },
                    ],
                  },
                  {
                    type: "text",
                    name: "ratingScaleEnd",
                    title: "End",
                    inputType: "number",
                    isRequired: true,
                    validators: [
                      {
                        type: "numeric",
                        minValue: 1,
                        maxValue: 20,
                        text: "Please enter a value between 1 and 20.",
                      },
                    ],
                  },
                ],
              },
            ],
            panelCount: 1,
            minPanelCount: 1,
            maxPanelCount: 15,
            panelAddText: "Add Form Element ╋",
            panelRemoveText: "Remove Element",
          },
        ],
      },
    ],
  };

  const [userQuestions, setUserQuestions] = useState(null);
  const [surveyInfo, setSurveyInfo] = useState(null);
  const [surveyResult, setSurveyResult] = useState(null);
  const [step, setStep] = useState(1);
  const [savedSurveyData, setSavedSurveyData] = useState(null);
  const [isPreviewCompleted, setIsPreviewCompleted] = useState(false);

  const handleFirstSurveyCompletion = (result) => {
    const surveyTitle = result.data.surveyTitle;
    const surveyDescription = result.data.surveyDescription || "";
    const generatedQuestions = result.data.dynamicQuestions.map((panel) => ({
      type: panel.questionType,
      text: panel.questionText || panel.questionDescription || panel.ratingQuestionText || "",
      title: panel.questionTitle || "",
      description: panel.questionDescription || "",
      ratingScale:
        panel.questionType === "Rating Scale"
          ? { start: panel.ratingScaleStart, end: panel.ratingScaleEnd }
          : null,
    }));

    setSurveyInfo({ title: surveyTitle, description: surveyDescription });
    setUserQuestions(generatedQuestions);
    setSurveyResult(result.data);
    setSavedSurveyData(result.data);
    setStep(2);
  };

  const generatePreviewSurveyJson = (questions, surveyInfo, surveyResult) => {
    return {
      title: surveyInfo.title,
      description: surveyInfo.description,
      showQuestionNumbers: "off",
      completeText: "Done",
      pages: [
        {
          name: "page2",
          elements: questions.map((question, index) => {
            if (question.type === "Short Answer") {
              return {
                type: "text",
                name: `question_${index}`,
                title: question.text,
                defaultValue: surveyResult[`dynamicQuestions[${index}].questionText`],
                readOnly: true,
              };
            } else if (question.type === "Long Answer") {
              return {
                type: "comment",
                name: `question_${index}`,
                title: question.text,
                defaultValue: surveyResult[`dynamicQuestions[${index}].questionText`],
                readOnly: true,
              };
            } else if (question.type === "Description") {
              return {
                type: "html",
                name: `description_${index}`,
                html: `
                  <h4>${question.title || "Description"}</h4>
                  <p>${question.description}</p>
                `,
              };
            } else if (question.type === "Rating Scale") {
              return {
                type: "rating",
                name: `question_${index}`,
                title: question.text,
                rateMin: question.ratingScale.start,
                rateMax: question.ratingScale.end,
                defaultValue: surveyResult[`dynamicQuestions[${index}].ratingQuestionText`],
                readOnly: true,
              };
            }
            return null;
          }),
        },
      ],
    };
  };

  const handleBackToEdit = () => {
    setStep(1);
  };

  const handleSendToDatabase = async () => {
    // Format start and end dates to ensure the correct time is applied
    const assignedDate = formatDateToMySQL(startDate, 0, 0, 0); // Set to midnight
    const deadlineDate = formatDateToMySQL(endDate, 23, 59, 59); // Set to 11:59:59 PM    

    // Ensure CreatorID and GroupID are provided.
    if (!creatorID || !groupID) {
      console.error("CreatorID or GroupID is missing.");
      return;
    }

    const formData = {
      FormName: surveyInfo.title,
      CreatorID: creatorID,
      GroupID: groupID,
      Assigned: assignedDate,
      Deadline: deadlineDate,
      QuestionList: userQuestions,
    };

    // console.log("Form Data:", formData);

    try {
      const response = await fetch("http://localhost:1000/forms/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
      } else {
        const errorMessage = await response.text();
        console.error("Failed to send form data:", errorMessage);
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      alert("An error occurred while sending form data.");
    }
  };



  const handlePreviewCompletion = () => {
    handleSendToDatabase();
    setIsPreviewCompleted(true);
  };

  return (
    <main>
      <div className="App">
        {step === 1 && (
          <Survey
            model={new Model(surveyJson)}
            onComplete={handleFirstSurveyCompletion}
            data={savedSurveyData}
          />
        )}

        {step === 2 && userQuestions && surveyInfo && surveyResult && (
          <div>
            {isPreviewCompleted ? (
              <ThankYouPage />
            ) : (
              <>
                <Survey
                  model={new Model(generatePreviewSurveyJson(userQuestions, surveyInfo, surveyResult))}
                  
                  onComplete={handlePreviewCompletion}
                />
                <button onClick={handleBackToEdit} className="back-button">
                  <FontAwesomeIcon id="back-arrow" icon={faArrowLeft} />
                  Edit Form
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
