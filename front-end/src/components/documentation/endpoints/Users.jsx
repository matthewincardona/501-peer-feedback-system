import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Users = () => {
    const endpoints = [
        {
            path: "/users/searchUser",
            method: "GET",
            queryParams: [
                { name: "email", type: "String", description: "Email of the user" }
            ],
            output: "Returns user data if found, otherwise an error message."
        },
        {
            path: "/users/getCreatorPermissions",
            method: "GET",
            queryParams: [
                { name: "CreatorID", type: "String", description: "ID of the creator" }
            ],
            output: "Returns the permissions for the specified creator."
        },
        {
            path: "/users/:groupId",
            method: "GET",
            pathParams: [
                { name: "groupId", type: "String", description: "ID of the group" }
            ],
            output: "Returns users that belong to the specified group."
        },
        {
            path: "/users/username/:username",
            method: "GET",
            pathParams: [
                { name: "username", type: "String", description: "Username of the user" }
            ],
            output: "Returns user data by username if found."
        },
        {
            path: "/users/getCreators/:groupID",
            method: "GET",
            pathParams: [
                { name: "groupID", type: "String", description: "ID of the group" }
            ],
            output: "Returns a list of creators for the specified group."
        },
        {
            path: "/users/setCreatorPermissions",
            method: "PUT",
            bodyParams: [
                { name: "Permissions", type: "Array", description: "List of permissions to set" },
                { name: "CreatorID", type: "String", description: "ID of the creator" }
            ],
            output: "Updates the permissions for a creator and returns a success message."
        },
        {
            path: "/users/addUser",
            method: "POST",
            bodyParams: [
                { name: "userName", type: "String", description: "Username of the new user" },
                { name: "password", type: "String", description: "Password for the new user" },
                { name: "firstName", type: "String", description: "First name of the new user" },
                { name: "lastName", type: "String", description: "Last name of the new user" },
                { name: "accessLevel", type: "String", description: "Access level for the new user" }
            ],
            output: "Creates a new user and returns the created user data."
        },
        {
            path: "/users/setCreator/:groupID",
            method: "POST",
            pathParams: [
                { name: "groupID", type: "String", description: "ID of the group" }
            ],
            bodyParams: [
                { name: "userID", type: "String", description: "ID of the user to set as creator" },
                { name: "creatorPermissions", type: "Array", description: "Permissions for the creator" }
            ],
            output: "Sets a user as the creator for a group and returns the result."
        },
        {
            path: "/users/setResponder/:groupID",
            method: "POST",
            pathParams: [
                { name: "groupID", type: "String", description: "ID of the group" }
            ],
            bodyParams: [
                { name: "responderID", type: "String", description: "ID of the user to set as responder" },
                { name: "teamID", type: "String", description: "ID of the team" }
            ],
            output: "Sets a user as a responder for a group and returns the result."
        },
        {
            path: "/users/:username",
            method: "DELETE",
            pathParams: [
                { name: "username", type: "String", description: "Username of the user to delete" }
            ],
            output: "Deletes the specified user and returns a success message. Returns an error if the user is not found."
        },
        {
            path: "/users/reviewer/:reviewerID",
            method: "GET",
            pathParams: [
                { name: "reviewerID", type: "String", description: "ID of the reviewer" }
            ],
            output: "Returns user data for a specified reviewer."
        },
        {
            path: "/users/deleteFromGroup/:groupID/:userID",
            method: "DELETE",
            pathParams: [
                { name: "groupID", type: "String", description: "ID of the group" },
                { name: "userID", type: "String", description: "ID of the user to delete from the group" }
            ],
            output: "Deletes a user from a specified group and returns a success message."
        }
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Users API Documentation
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

export default Users;
