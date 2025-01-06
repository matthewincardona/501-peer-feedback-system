import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';

const CreatorTable = ({ users, setUsers, groupID }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openUser, setOpenUser] = useState({});

    const permissions = [
        { id: 'canSeeResponses', label: 'Can see responses' },
        { id: 'canViewGroup', label: 'Can view group' },
        { id: 'canEditForm', label: 'Can edit form' },
        { id: 'canDeleteForm', label: 'Can delete form' },
    ];

    useEffect(() => {
        // If users prop changes, update the local state (if needed).
    }, [users]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleUserClick = (userId) => {
        setOpenUser((prev) => ({
            ...prev,
            [userId]: !prev[userId], // Toggle the specific user
        }));
    };

    // Function to change the permission
    const changePermission = async (userId, permissionId) => {
        setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) => {
                if (user.UserID === userId) {
                    const newPermissions = {
                        ...user.permissions,
                        [permissionId]: !user.permissions[permissionId], // Toggle the permission
                    };
                    updatePermissionsInDatabase(userId, newPermissions); // Update the database
                    return { ...user, permissions: newPermissions };
                }
                return user;
            });
            return updatedUsers;
        });
    };

    // Function to send the updated permissions to the database
    const updatePermissionsInDatabase = async (CreatorID, updatedPermissions) => {
        try {
            const response = await fetch('http://localhost:1000/users/setCreatorPermissions', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CreatorID,
                    Permissions: updatedPermissions,
                    GroupID: groupID, // Include groupID in the request
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update permissions');
            }
            const result = await response.json();
            // console.log('Permissions updated successfully:', result);
        } catch (error) {
            console.error('Error updating permissions:', error);
        }
    };

    return (
        <Paper>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="creator table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '50%' }}>User Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                            <React.Fragment key={user.UserID}>
                                <TableRow>
                                    <TableCell>
                                        <ListItemButton onClick={() => handleUserClick(user.UserID)}>
                                            <ListItemText
                                                primary={`${index + 1}. ${user.FirstName} ${user.LastName}`}
                                            />
                                            {openUser[user.UserID] ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={1}>
                                        <Collapse in={openUser[user.UserID]} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {permissions.map((permission) => (
                                                    <ListItem key={permission.id}>
                                                        <Checkbox
                                                            sx={{ '&.Mui-checked': { color: '#f76902' } }}
                                                            checked={user.permissions[permission.id] || false}  // Reflect permission status
                                                            onChange={() => changePermission(user.UserID, permission.id)} // Update on checkbox click
                                                        />
                                                        <span
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => changePermission(user.UserID, permission.id)}  // Toggle on label click
                                                        >
                                                            {permission.label}
                                                        </span>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default CreatorTable;

