import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import "survey-core/defaultV2.min.css";
import "survey-core/survey.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ThankYouPage from "../../components/ui/ThankYouPage.jsx";
import NavigationHeader from '../../components/ui/NavigationHeader';
import './form.css';
import dayjs from 'dayjs';


const EditForm = () => {
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [surveyJson, setSurveyJson] = useState(null);
    const [surveyInfo, setSurveyInfo] = useState(null);
    const [userQuestions, setUserQuestions] = useState(null);
    const [surveyResult, setSurveyResult] = useState(null);
    const [isPreviewCompleted, setIsPreviewCompleted] = useState(false);

  const startDate = dayjs(location.state?.startDate).format('YYYY-MM-DD');
  const endDate = dayjs(location.state?.endDate).format('YYYY-MM-DD');


    const formID = localStorage.getItem('formID');
    console.log(endDate);
    useEffect(() => {
        const fetchSurveyData = async () => {
            try {
                const response = await fetch(`http://localhost:1000/forms/id/${formID}`);
                const data = await response.json();
                const formDetails = data.result[0];

                const panels = formDetails.QuestionList.map((question) => {
                    return {
                        questionType: question.type,
                        questionText: question.text,
                        questionTitle: question.title,
                        questionDescription: question.description,
                        ratingScaleStart: question.ratingScale?.start,
                        ratingScaleEnd: question.ratingScale?.end,
                        ratingQuestionText: question.type === "Rating Scale" ? question.text : "",
                    };
                });

                const surveyStructure = {
                    showQuestionNumbers: "off",
                    completeText: "Preview",
                    showCompletedPage: false, // Disable default thank-you message
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
                                            defaultValue: formDetails.FormName,
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
                                                    defaultValue: "",
                                                },
                                                {
                                                    type: "text",
                                                    name: "ratingScaleStart",
                                                    title: "Start",
                                                    inputType: "number",
                                                    isRequired: true,
                                                },
                                                {
                                                    type: "text",
                                                    name: "ratingScaleEnd",
                                                    title: "End",
                                                    inputType: "number",
                                                    isRequired: true,
                                                },
                                            ],
                                        },
                                    ],
                                    panelCount: panels.length,
                                    minPanelCount: 1,
                                    maxPanelCount: 5,
                                    panelAddText: "Add Form Element ╋",
                                    panelRemoveText: "Remove Element",
                                    defaultValue: panels,
                                },
                            ],
                        },
                    ],
                };

                setSurveyJson(surveyStructure);
            } catch (error) {
                console.error("Failed to fetch survey data:", error);
            }
        };

        if (formID) {
            fetchSurveyData();
        }
    }, [formID]);

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
                    ? { start: panel.ratingScaleStart, end: panel.ratingScaleEnd } : null,
        }));

        setSurveyInfo({ title: surveyTitle, description: surveyDescription });
        setUserQuestions(generatedQuestions);
        setSurveyResult(result.data);
        setStep(2);
    };

    const generatePreviewSurveyJson = (questions, surveyInfo, surveyResult) => {
        return {
            title: surveyInfo.title,
            description: surveyInfo.description,
            showQuestionNumbers: "off",
            completeText: "Done",
            showCompletedPage: false, // Disable default thank-you message for preview
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
    const formatDateForSQL = (date) => {
        const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
        return formattedDate;
    };
    const formatDateToMySQL = (dateString, defaultHours = 0, defaultMinutes = 0, defaultSeconds = 0) => {
        // Use dayjs to parse and set the time directly
        const dt = dayjs(dateString)
          .hour(defaultHours)
          .minute(defaultMinutes)
          .second(defaultSeconds);
    
        return dt.format('YYYY-MM-DD HH:mm:ss'); // MySQL-compatible format
      };
    const handlePreviewCompletion = async () => {
        try {
            const assignedDate = formatDateToMySQL(startDate, 0, 0, 0); // Set to midnight
            const deadlineDate = formatDateToMySQL(endDate, 23, 59, 59); // Set to 11:59:59 PM            
            const response = await fetch(`http://localhost:1000/forms/updateForm`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formName: surveyInfo.title,
                    Assigned: assignedDate,
                    Deadline: deadlineDate,
                    QuestionList: userQuestions,
                    formID
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setIsPreviewCompleted(true); // Show thank you page upon successful update
            } else {
                const errorData = await response.json();
                console.error("Failed to update form:", errorData.error);
            }
        } catch (error) {
            console.error("Error updating form:", error);
        }
    };

    return (
        <main>
            <NavigationHeader />
            <div className="App">
                {step === 1 && (
                    <Survey
                        model={new Model(surveyJson)}
                        onComplete={handleFirstSurveyCompletion}
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

export default EditForm;
