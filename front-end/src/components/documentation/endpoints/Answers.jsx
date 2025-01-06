import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Answers = () => {
    const endpoints = [
        {
            path: "/answers/responses/form",
            method: "GET",
            queryParams: [
                { name: "userID", type: "String", description: "ID of the user" },
                { name: "formID", type: "String", description: "ID of the form" }
            ],
            output: "Returns responses from a specific user for a given form."
        },
        {
            path: "/answers/getuserevaluations",
            method: "GET",
            queryParams: [
                { name: "userID", type: "String", description: "ID of the user" },
                { name: "formID", type: "String", description: "ID of the form" }
            ],
            output: "Returns evaluations related to a specific user for a given form."
        },
        {
            path: "/assignments/incomplete",
            method: "GET",
            queryParams: [
                { name: "formID", type: "String", description: "ID of the form" },
                { name: "reviewerID", type: "String", description: "ID of the reviewer" }
            ],
            output: "Fetches only incomplete assignments for the reviewer in their team."
        },
        {
            path: "/answers/responses/number",
            method: "GET",
            queryParams: [
                { name: "formID", type: "String", description: "ID of the form" }
            ],
            output: "Returns the number of responses for a given form."
        },
        {
            path: "/answers/insert",
            method: "POST",
            bodyParams: [
                { name: "UserID", type: "String", description: "ID of the user submitting the response" },
                { name: "ReviewedID", type: "String", description: "ID of the user being reviewed" },
                { name: "FormID", type: "String", description: "ID of the form" },
                { name: "Answers", type: "Array", description: "Array of answers to be submitted" }
            ],
            output: "Inserts a new response and returns the result."
        },
        {
            path: "/answers/getAllAnswersByForm",
            method: "POST",
            bodyParams: [
                { name: "formID", type: "String", description: "ID of the form" }
            ],
            output: "Returns all answers from a specific form."
        }
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                API Documentation
            </Typography>
            {endpoints.map((endpoint, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <Typography variant="h6">{`${endpoint.method} ${endpoint.path}`}</Typography>
                    {endpoint.queryParams && (
                        <div>
                            <Typography variant="subtitle1">Query Parameters:</Typography>
                            <List>
                                {endpoint.queryParams.map((param, i) => (
                                    <ListItem key={i}>
                                        <ListItemText
                                            primary={`${param.name} (${param.type})`}
                                            secondary={param.description}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    )}
                    {endpoint.bodyParams && (
                        <div>
                            <Typography variant="subtitle1">Body Parameters:</Typography>
                            <List>
                                {endpoint.bodyParams.map((param, i) => (
                                    <ListItem key={i}>
                                        <ListItemText
                                            primary={`${param.name} (${param.type})`}
                                            secondary={param.description}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    )}
                    <Typography variant="subtitle1">Output:</Typography>
                    <Typography variant="body1">{endpoint.output}</Typography>
                </div>
            ))}
        </Container>
    );
};

export default Answers;
