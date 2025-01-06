import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Teams = () => {
    const endpoints = [
        {
            path: "/:groupId",
            method: "GET",
            pathParams: [
                { name: "groupId", type: "String", description: "ID of the group" }
            ],
            output: "Returns the list of teams associated with a given group ID."
        },
        {
            path: "/createTeam",
            method: "POST",
            bodyParams: [
                { name: "GroupID", type: "String", description: "ID of the group to which the team belongs" },
                { name: "TeamName", type: "String", description: "Name of the new team" }
            ],
            output: "Creates a new team and returns a success message along with the new Team ID."
        },
        {
            path: "/deleteTeam/:teamId/:groupId",
            method: "DELETE",
            pathParams: [
                { name: "teamId", type: "String", description: "ID of the team to be deleted" },
                { name: "groupId", type: "String", description: "ID of the group the team belongs to" }
            ],
            output: "Deletes the specified team and returns a success message or an error if not found."
        }
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Teams API Documentation
            </Typography>
            {endpoints.map((endpoint, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <Typography variant="h6">{`${endpoint.method} ${endpoint.path}`}</Typography>
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

export default Teams;
