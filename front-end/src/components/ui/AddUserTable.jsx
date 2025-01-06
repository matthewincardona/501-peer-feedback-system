import * as React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

// Helper function to create user data
export const createUser = (firstName, lastName, email, group = null) => {
    const user = {
        name: `${firstName} ${lastName}`,
        email: email,
        group,
    };
    return user;
};


const AddUserTable = ({ users, onDeleteUser, showGroup = false }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell> {/* Column for email */}
                            {showGroup && <TableCell>Teams</TableCell>}
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography>No users available</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                                <TableRow
                                    key={user.userName}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{`${page * rowsPerPage + index + 1}. ${user.name}`}</TableCell>
                                    <TableCell>{user.email}</TableCell> {/* Displaying the user's email */}
                                    {showGroup && user.group && (
                                        <TableCell>
                                            <FontAwesomeIcon icon={faUser} style={{ marginRight: 8 }} />
                                            {user.group}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                    <FontAwesomeIcon 
                                        icon={faTrashCan} 
                                        style={{ color: '#DA291C', cursor: 'pointer' }} 
                                        onClick={() => onDeleteUser(user.ID)} // Pass both user.ID and user.userName
                                    />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
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

export default AddUserTable;
