import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Dependencies = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Getting Started with Development
            </Typography>
            <Typography variant="body1" paragraph>
                This guide will walk you through setting up and running the project, including both the backend and frontend components. The project uses React and Vite for the frontend to ensure fast development and optimized builds.
            </Typography>

            <Typography variant="h5" gutterBottom style={{ marginTop: '30px' }}>
                Tools and Frameworks Used
            </Typography>
            <List>
                <ListItem>
                    <ListItemText
                        primary="React"
                        secondary="A popular JavaScript library for building user interfaces. React helps to create reusable UI components and manage state efficiently."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Vite"
                        secondary="A build tool that provides a faster and leaner development experience for modern web projects. Vite is used for rapid development with optimized hot module replacement (HMR)."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Node.js"
                        secondary="A JavaScript runtime environment that executes code server-side, enabling the backend of this project."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="npm (Node Package Manager)"
                        secondary="A tool for managing project dependencies and running development scripts."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Material-UI (MUI)"
                        secondary="A comprehensive library for building interactive and customizable UI components in React. MUI is used to provide a consistent design and user experience throughout the project."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Font Awesome"
                        secondary="A popular icon library that provides a wide range of customizable icons. Font Awesome is used to enhance the visual appeal and user interaction within the project."
                    />
                </ListItem>
            </List>

            <Typography variant="h5" gutterBottom>
                Running the Project
            </Typography>
            <Typography variant="body1" paragraph>
                Follow the steps below to set up and run the backend and frontend of the project:
            </Typography>

            <Typography variant="h6" gutterBottom>
                1. Running the Backend
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Navigate to the backend directory" secondary={`cd back-end`} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Install dependencies" secondary={`npm i`} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Run the backend server" secondary={`node index.js`} />
                </ListItem>
            </List>
            <Typography variant="body1">
                The backend server should now be running at localhost:1000.
            </Typography>

            <Typography variant="h6" gutterBottom style={{ marginTop: '30px' }}>
                2. Running the Frontend
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Navigate to the frontend directory" secondary={`cd front-end`} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Install dependencies" secondary={`npm i`} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Run the frontend development server" secondary={`npm run dev`} />
                </ListItem>
            </List>
            <Typography variant="body1">
                Once the frontend server is running, open your browser and navigate to:
            </Typography>
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer">http://localhost:5173</a>
            </Typography>

        </Container>
    );
};

export default Dependencies;
