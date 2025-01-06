import React from 'react';
import { Container, Typography } from '@mui/material';

const OAuth = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                OAuth Integration
            </Typography>
            <Typography variant="body1" paragraph>
                This project currently uses Okta OAuth for development purposes. The future plan is to transition to using RIT Shibboleth to integrate with their systems for user authentication and data management.
            </Typography>

            <Typography variant="h5" gutterBottom style={{ marginTop: '30px' }}>
                Current OAuth Workflow
            </Typography>
            <Typography variant="body1" paragraph>
                To start the login process, navigate to:
            </Typography>
            <Typography variant="body1" paragraph style={{ fontStyle: 'italic' }}>
                <a href="http://localhost:1000/login" target="_blank" rel="noopener noreferrer">
                    http://localhost:1000/login
                </a>
            </Typography>
            <Typography variant="body1" paragraph>
                This link will redirect you to the Okta login page. After successful authentication, you will be redirected to the dashboard page of the application.
            </Typography>

            <Typography variant="h5" gutterBottom style={{ marginTop: '30px' }}>
                User Data Retrieval
            </Typography>
            <Typography variant="body1" paragraph>
                The application pulls all user data from the following endpoint:
            </Typography>
            <Typography variant="body1" paragraph style={{ fontStyle: 'italic' }}>
                <a href="http://localhost:1000/profile" target="_blank" rel="noopener noreferrer">
                    http://localhost:1000/profile
                </a>
            </Typography>
            <Typography variant="body1" paragraph>
                This endpoint retrieves user data after a successful login, ensuring that the user's profile information is available within the application.
            </Typography>

            <Typography variant="h5" gutterBottom style={{ marginTop: '30px' }}>
                Future Integration Plan
            </Typography>
            <Typography variant="body1" paragraph>
                The ultimate goal is to integrate RIT Shibboleth for authentication, allowing the application to leverage RIT's systems for secure and seamless user access.
            </Typography>
        </Container>
    );
};

export default OAuth;
