import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const FileStructure = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                File Structure
            </Typography>
            <Typography variant="body1" paragraph>
                This project follows a structured approach to organize components and pages:
            </Typography>
            <Typography variant="h6" gutterBottom>
                Components
            </Typography>
            <List>
                <ListItem>
                    <ListItemText
                        primary="UI Components"
                        secondary={`Place all UI components (e.g., buttons, cards, tabs, tables) in the following directory: src > components > ui. The .jsx and .css files for each component should be placed in the same folder.`}
                    />
                </ListItem>
            </List>
            <Typography variant="h6" gutterBottom>
                Pages
            </Typography>
            <List>
                <ListItem>
                    <ListItemText
                        primary="Pages Directory"
                        secondary={`Use the “pages” folder for all main application pages.`}
                    />
                </ListItem>
            </List>
        </Container>
    );
};

export default FileStructure;
