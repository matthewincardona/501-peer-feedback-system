import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NavigationHeader from '../../components/ui/NavigationHeader';
import ResponseCard from '../../components/ui/ResponseCard';
import './styles.css';

function ResponsesPage() {
    const [responses, setResponses] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [selectedReviewee, setSelectedReviewee] = useState('');
    const [selectedReviewer, setSelectedReviewer] = useState('');

    const selectedFormID = localStorage.getItem("selectedFormID");
    var selectedUserID = localStorage.getItem("selectedUserID");
    // console.log("SelectedUserID", selectedUserID);

    // Fetch responses created by the user
    const fetchUserResponses = async (userID) => {
        try {
            const response = await fetch(`http://localhost:1000/answers/responses/form?formID=${selectedFormID}&userID=${userID}`);
            if (!response.ok) throw new Error(`Failed to fetch responses: ${response.statusText}`);
            const responsesData = await response.json();
            // console.log("Responses Data", responsesData);

            setResponses(responsesData);
            if (responsesData.length > 0) {
                setSelectedReviewee(responsesData[0].Reviewee); // Set initial selected reviewee
            }
        } catch (error) {
            console.error("Error fetching responses:", error);
        }
    };

    // Fetch evaluations made about the user
    const fetchUserEvaluations = async (userID) => {
        try {
            const response = await fetch(`http://localhost:1000/answers/getuserevaluations/?formID=${selectedFormID}&userID=${userID}`);
            if (!response.ok) throw new Error(`Failed to fetch evaluations: ${response.statusText}`);
            const evaluationsData = await response.json();
            // console.log("Evaluations Data", evaluationsData);
            // console.log(evaluationsData);

            setEvaluations(evaluationsData);
            if (evaluationsData.length > 0) {
                setSelectedReviewer(evaluationsData[0].Reviewer); // Set initial selected reviewer
            }
        } catch (error) {
            console.error("Error fetching evaluations:", error);
        }
    };

    // Get the User ID when the component mounts
    useEffect(() => {
        fetchUserResponses(selectedUserID);
        fetchUserEvaluations(selectedUserID);
    }, []);

    const handleRevieweeChange = (event) => {
        setSelectedReviewee(event.target.value);
    };

    const handleReviewerChange = (event) => {
        setSelectedReviewer(event.target.value);
    };

    const selectedResponse = responses.find(response => response.Reviewee === parseInt(selectedReviewee));
    const selectedEvaluation = evaluations.find(evaluation => evaluation.Reviewer === parseInt(selectedReviewer));

    return (
        <main className="responsesPage">
            <NavigationHeader />
            <div className="responsesPage__container">

                {/* User's Responses Section */}
                <div className='responsesPage__evals'>
                    <h4>Responses</h4>
                    {responses.length > 0 ? (
                        <>
                            <Box sx={{ minWidth: 120, maxWidth: 400, marginBottom: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="reviewee-select-label">Select Reviewee</InputLabel>
                                    <Select
                                        labelId="reviewee-select-label"
                                        id="reviewee-select"
                                        value={selectedReviewee}
                                        label="Select Reviewee"
                                        onChange={handleRevieweeChange}
                                    >
                                        {responses.map((response, index) => (
                                            <MenuItem key={index} value={response.Reviewee}>
                                                {response.RevieweeFullName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            {selectedResponse ? (
                                <div className="responsesPage__reviewCard">
                                    <ResponseCard respData={selectedResponse.Answers} />
                                </div>
                            ) : (
                                <p style={{ marginTop: '-20px' }}>No responses found for the selected reviewee.</p>
                            )}
                        </>
                    ) : (
                        <p style={{ marginTop: '-20px' }}>No responses found for this user.</p>
                    )}
                </div>

                <hr className='responsesPage__divider' />

                {/* Evaluations Section */}
                <div className='responsesPage__evals'>
                    <h4>Evaluations</h4>
                    {evaluations.length > 0 ? (
                        <>
                            <Box sx={{ minWidth: 120, maxWidth: 400, marginBottom: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="reviewer-select-label">Select Reviewer</InputLabel>
                                    <Select
                                        labelId="reviewer-select-label"
                                        id="reviewer-select"
                                        value={selectedReviewer}
                                        label="Select Reviewer"
                                        onChange={handleReviewerChange}
                                    >
                                        {evaluations.map((evaluation, index) => (
                                            <MenuItem key={index} value={evaluation.Reviewer}>
                                                {evaluation.ReviewerFullName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            {selectedEvaluation ? (
                                <div className="responsesPage__evaluationCard">
                                    <ResponseCard respData={selectedEvaluation.Answers} />
                                </div>
                            ) : (
                                <p style={{ marginTop: '-20px' }}>No evaluations found for the selected reviewer.</p>
                            )}
                        </>
                    ) : (
                        <p style={{ marginTop: '-20px' }}>No evaluations found for this user.</p>
                    )}
                </div>
            </div>
        </main>
    );
}

export default ResponsesPage;
