import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Forms = () => {
    const endpoints = [
        {
            path: "/forms/user/:userId",
            method: "GET",
            params: [
                { name: "userId", type: "String", description: "ID of the user" }
            ],
            output: "Returns all forms associated with a specific user."
        },
        {
            path: "/forms/creator/:creatorId",
            method: "GET",
            params: [
                { name: "creatorId", type: "String", description: "ID of the creator" }
            ],
            output: "Returns all forms created by a specific user."
        },
        {
            path: "/forms/insert",
            method: "POST",
            bodyParams: [
                { name: "FormName", type: "String", description: "Name of the form" },
                { name: "CreatorID", type: "String", description: "ID of the creator" },
                { name: "GroupID", type: "String", description: "ID of the group" },
                { name: "Assigned", type: "Date", description: "Assignment date" },
                { name: "Deadline", type: "Date", description: "Deadline date" },
                { name: "QuestionList", type: "Array", description: "List of questions in the form" }
            ],
            output: "Inserts a new form and returns a success message."
        },
        {
            path: "/forms/id/:formID",
            method: "GET",
            params: [
                { name: "formID", type: "String", description: "ID of the form" }
            ],
            output: "Returns details of a form by its ID."
        },
        {
            path: "/forms/updateForm",
            method: "PUT",
            bodyParams: [
                { name: "formID", type: "String", description: "ID of the form" },
                { name: "formName", type: "String", description: "Updated form name" },
                { name: "Assigned", type: "Date", description: "Updated assignment date" },
                { name: "Deadline", type: "Date", description: "Updated deadline date" },
                { name: "QuestionList", type: "Array", description: "Updated list of questions" }
            ],
            output: "Updates the form and returns the updated form data."
        },
        {
            path: "/forms/delete",
            method: "DELETE",
            bodyParams: [
                { name: "formID", type: "String", description: "ID of the form to be deleted" }
            ],
            output: "Deletes the form and returns a success message."
        },
        {
            path: "/forms/edit/:groupId/:userId",
            method: "GET",
            params: [
                { name: "groupId", type: "String", description: "ID of the group" },
                { name: "userId", type: "String", description: "ID of the user" }
            ],
            output: "Returns group details for editing."
        },
        {
            path: "/forms/edit",
            method: "PUT",
            bodyParams: [
                { name: "groupId", type: "String", description: "ID of the group" },
                { name: "userId", type: "String", description: "ID of the user" },
                { name: "formName", type: "String", description: "Name of the form" },
                { name: "assigned", type: "Date", description: "Assigned date" },
                { name: "deadline", type: "Date", description: "Deadline date" }
            ],
            output: "Updates and sets new details for a form, returning a success message."
        },
        {
            path: "/:formID/assigned",
            method: "GET",
            params: [
                { name: "formID", type: "String", description: "ID of the form" }
            ],
            output: "Returns the assigned date of a form."
        },
        {
            path: "/:formID/deadline",
            method: "GET",
            params: [
                { name: "formID", type: "String", description: "ID of the form" }
            ],
            output: "Returns the deadline date of a form."
        },
        {
            path: "/forms/markFormAsCompleted",
            method: "POST",
            bodyParams: [
                { name: "userID", type: "String", description: "ID of the user" },
                { name: "formID", type: "String", description: "ID of the form" }
            ],
            output: "Marks a form as completed for the specified user."
        }
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Forms API Documentation
            </Typography>
            {endpoints.map((endpoint, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <Typography variant="h6">{`${endpoint.method} ${endpoint.path}`}</Typography>
                    {endpoint.params && (
                        <div>
                            <Typography variant="subtitle1">Path Parameters:</Typography>
                            <List>
                                {endpoint.params.map((param, i) => (
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

export default Forms;
