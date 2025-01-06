import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Container, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Dependencies from '../../components/documentation/GettingStarted/Dependencies';
import FileStructure from '../../components/documentation/GettingStarted/FileStructure';
import Styling from '../../components/documentation/GettingStarted/Styling';
import Introduction from '../../components/documentation/Introduction';
import OAuth from '../../components/documentation/OAuth';
import Answers from '../../components/documentation/endpoints/Answers';
import Forms from '../../components/documentation/endpoints/Forms';
import Groups from '../../components/documentation/endpoints/Groups';
import Teams from '../../components/documentation/endpoints/Teams';
import Users from '../../components/documentation/endpoints/Users';

const drawerWidth = 240;

function Documentation() {
    const [selectedComponent, setSelectedComponent] = useState('Introduction');
    const [openGettingStarted, setOpenGettingStarted] = useState(false);
    const [openEndpoints, setOpenEndpoints] = useState(false);

    const handleMenuClick = (component) => {
        setSelectedComponent(component);
    };

    const handleGettingStartedClick = () => {
        setOpenGettingStarted(!openGettingStarted);
    };

    const handleEndpointsClick = () => {
        setOpenEndpoints(!openEndpoints);
    };

    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            {/* Sidebar/Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <List>
                    <ListItem style={{ cursor: 'pointer' }} button onClick={() => handleMenuClick('Introduction')}>
                        <ListItemText primary="Introduction" />
                    </ListItem>

                    {/* Dropdown for Getting Started */}
                    <ListItem style={{ cursor: 'pointer' }} button onClick={handleGettingStartedClick}>
                        <ListItemText primary="Getting Started" />
                        {openGettingStarted ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openGettingStarted} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem style={{ cursor: 'pointer' }} button sx={{ pl: 4 }} onClick={() => handleMenuClick('Dependencies')}>
                                <ListItemText primary="Development" />
                            </ListItem>
                            <ListItem style={{ cursor: 'pointer' }} button sx={{ pl: 4 }} onClick={() => handleMenuClick('File Structure')}>
                                <ListItemText primary="File Structure" />
                            </ListItem>
                            <ListItem style={{ cursor: 'pointer' }} button sx={{ pl: 4 }} onClick={() => handleMenuClick('Styling')}>
                                <ListItemText primary="Styling" />
                            </ListItem>
                        </List>
                    </Collapse>

                    {/* Dropdown for Endpoints */}
                    <ListItem style={{ cursor: 'pointer' }} button onClick={handleEndpointsClick}>
                        <ListItemText primary="Endpoints" />
                        {openEndpoints ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openEndpoints} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem style={{ cursor: 'pointer' }} button sx={{ pl: 4 }} onClick={() => handleMenuClick('Answers')}>
                                <ListItemText primary="Answers" />
                            </ListItem>
                            <ListItem style={{ cursor: 'pointer' }} button sx={{ pl: 4 }} onClick={() => handleMenuClick('Forms')}>
                                <ListItemText primary="Forms" />
                            </ListItem>
                            <ListItem style={{ cursor: 'pointer' }} button sx={{ pl: 4 }} onClick={() => handleMenuClick('Groups')}>
                                <ListItemText primary="Groups" />
                            </ListItem>
                            <ListItem style={{ cursor: 'pointer' }} button sx={{ pl: 4 }} onClick={() => handleMenuClick('Teams')}>
                                <ListItemText primary="Teams" />
                            </ListItem>
                            <ListItem style={{ cursor: 'pointer' }} button sx={{ pl: 4 }} onClick={() => handleMenuClick('Users')}>
                                <ListItemText primary="Users" />
                            </ListItem>
                        </List>
                    </Collapse>

                    {/* OAuth */}
                    <ListItem style={{ cursor: 'pointer' }} button onClick={() => handleMenuClick('OAuth')}>
                        <ListItemText primary="OAuth" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Main Content */}
            <main style={{ flexGrow: 1, padding: '24px', marginBottom: '120px' }}>
                <Toolbar />
                <Container>
                    <Typography variant="h4" gutterBottom style={{ marginBottom: '40px', fontWeight: 'bold' }}>
                        Peer Feedback Tool Documentation
                    </Typography>
                    <div>
                        {/* Conditional rendering of the selected component */}
                        {selectedComponent === 'Introduction' && <Introduction />}
                        {selectedComponent === 'Dependencies' && <Dependencies />}
                        {selectedComponent === 'File Structure' && <FileStructure />}
                        {selectedComponent === 'Styling' && <Styling />}
                        {selectedComponent === 'Answers' && <Answers />}
                        {selectedComponent === 'Forms' && <Forms />}
                        {selectedComponent === 'Groups' && <Groups />}
                        {selectedComponent === 'Teams' && <Teams />}
                        {selectedComponent === 'Users' && <Users />}
                        {selectedComponent === 'OAuth' && <OAuth />}
                    </div>
                </Container>
            </main>
        </div>
    );
}

export default Documentation;
