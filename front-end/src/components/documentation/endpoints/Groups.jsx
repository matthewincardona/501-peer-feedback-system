import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Groups = () => {
    const endpoints = [
        {
            path: "/groups/getCreators",
            method: "GET",
            queryParams: [
                { name: "GroupId", type: "String", description: "ID of the group" }
            ],
            output: "Returns a list of creators for a given group."
        },
        {
            path: "/groups/:formId",
            method: "GET",
            pathParams: [
                { name: "formId", type: "String", description: "ID of the form" }
            ],
            output: "Returns groups associated with a given form ID."
        },
        {
            path: "/groups/team/users",
            method: "GET",
            queryParams: [
                { name: "teamID", type: "String", description: "ID of the team" }
            ],
            output: "Returns users within a specific team."
        },
        {
            path: "/groups/groupname/:groupID",
            method: "GET",
            pathParams: [
                { name: "groupID", type: "String", description: "ID of the group" }
            ],
            output: "Returns the name of the group identified by the group ID."
        },
        {
            path: "/groups/createGroup",
            method: "POST",
            bodyParams: [
                { name: "GroupName", type: "String", description: "Name of the group to be created" },
                { name: "CreatorID", type: "String", description: "ID of the user creating the group" }
            ],
            output: "Creates a new group and returns a message with the GroupID."
        },
        {
            path: "/groups/addUser",
            method: "POST",
            bodyParams: [
                { name: "userName", type: "String", description: "Username of the new user" },
                { name: "password", type: "String", description: "Password of the new user" },
                { name: "firstName", type: "String", description: "First name of the user" },
                { name: "lastName", type: "String", description: "Last name of the user" },
                { name: "accessLevel", type: "String", description: "Access level of the user (default is 'User')" }
            ],
            output: "Adds a new user and returns the user ID and the submitted user data."
        }
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Group API Documentation
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
                    {endpoint.pathParams && (
                        <div>
                            <Typography variant="subtitle1">Path Parameters:</Typography>
                            <List>
                                {endpoint.pathParams.map((param, i) => (
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

export default Groups;
