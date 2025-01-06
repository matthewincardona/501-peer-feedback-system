import * as React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrashCan, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const AddTeamsTable = ({ teams, onDeleteTeam, onEditTeam }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [editingTeam, setEditingTeam] = React.useState(null);
    const [editedName, setEditedName] = React.useState('');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditName = (team) => {
        setEditingTeam(team.id);
        setEditedName(team.name);
    };

    const handleSaveName = (team) => {
        if (editedName !== team.name) {
            onEditTeam(team.id, editedName);  // Call the edit function passed as prop
        }
        setEditingTeam(null);
        setEditedName('');
    };

    return (
        <Paper>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="teams table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Evaluation Team Names</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    <Typography>No teams available</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            teams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((team, index) => (
                                <TableRow
                                    key={team.id}  // Use team.id as a unique key
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        {editingTeam === team.id ? (
                                            <TextField
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                onBlur={() => handleSaveName(team)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault(); // Prevents form submission if TextField is in a form
                                                        handleSaveName(team);
                                                    }
                                                }}
                                                autoFocus
                                                size="small"
                                            />
                                        ) : (
                                            <>
                                                {`${page * rowsPerPage + index + 1}. ${team.name}`}
                                                <FontAwesomeIcon
                                                    icon={faPenToSquare}
                                                    style={{ marginLeft: 8 }}
                                                    aria-label="User Icon"
                                                    onClick={() => handleEditName(team)} // Start editing when name is clicked
                                                />
                                            </>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <FontAwesomeIcon
                                            icon={faTrashCan}
                                            style={{ color: '#DA291C', cursor: 'pointer' }}
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
                                                    onDeleteTeam(team.id); // Pass the correct team id
                                                }
                                            }}
                                            aria-label={`Delete ${team.name}`} // Accessibility feature
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
                count={teams.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default AddTeamsTable;
