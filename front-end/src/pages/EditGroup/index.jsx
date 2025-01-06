import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import IconButton from '../../components/ui/IconButton';
import AddTeamsTable from '../../components/ui/AddTeamsTable';
import { faPlus, faArrowRight, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import './style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function EditGroup() {
    const navigate = useNavigate();
    const location = useLocation();
    const { formID } = location.state || {};
    const [groupName, setGroupName] = useState('');
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [groupID, setGroupID] = useState(null);
    localStorage.setItem('formID',formID);
    // Fetch GroupID using the FormID or from localStorage
    useEffect(() => {
        const storedGroupID = localStorage.getItem('groupID');
        if (formID) {
            const fetchGroupID = async () => {
                try {
                    const response = await fetch(`http://localhost:1000/groups/getGroupIdByFormId/${formID}`);
                    if (!response.ok) throw new Error('Failed to fetch GroupID');
                    const data = await response.json();
                    setGroupID(data.GroupID);
                    localStorage.setItem('groupID', data.GroupID); // Store in localStorage
                } catch (error) {
                    console.error('Error fetching GroupID:', error);
                }
            };
            fetchGroupID();
        } else if (storedGroupID) {
            setGroupID(storedGroupID);
        }
    }, [formID]);

    // Fetch GroupName and Teams using GroupID or from localStorage
    useEffect(() => {
        const storedGroupName = localStorage.getItem('groupName');
        const storedTeams = localStorage.getItem('teams');

        if (groupID) {
            const fetchGroupDetails = async () => {
                try {
                    const groupNameResponse = await fetch(`http://localhost:1000/groups/groupname/${groupID}`);
                    if (!groupNameResponse.ok) throw new Error('Failed to fetch Group Name');
                    const groupNameData = await groupNameResponse.json();
                    setGroupName(groupNameData.GroupName);
                    localStorage.setItem('groupName', groupNameData.GroupName); // Store in localStorage

                    const teamsResponse = await fetch(`http://localhost:1000/teams/${groupID}`);
                    if (!teamsResponse.ok) throw new Error('Failed to fetch Teams');
                    const teamsData = await teamsResponse.json();
                    const formattedTeams = teamsData.map(team => ({ id: team.TeamID, name: team.TeamName, isEditing: false }));
                    setTeams(formattedTeams);
                    localStorage.setItem('teams', JSON.stringify(formattedTeams)); // Store in localStorage
                } catch (error) {
                    console.error('Error fetching group details:', error);
                }
            };
            fetchGroupDetails();
        } else if (storedGroupName && storedTeams) {
            setGroupName(storedGroupName);
            setTeams(JSON.parse(storedTeams));
        }
    }, [groupID]);


    const handleUpdateGroupName = async () => {
        if (groupName.trim() === '' || !groupID) {
            console.error("Group name or GroupID is missing.");
            return;
        }

        try {
            const response = await fetch('http://localhost:1000/groups/updateGroupName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ GroupID: groupID, GroupName: groupName }),
            });
            if (!response.ok) throw new Error('Failed to update group name');
            // console.log("Group name updated successfully.");
        } catch (error) {
            console.error('Error updating group name:', error);
        }
    };

    const handleEditTeamName = (teamID, newTeamName) => {
        setTeams(prevTeams =>
            prevTeams.map(team =>
                team.id === teamID ? { ...team, name: newTeamName, isEditing: false } : team
            )
        );
        saveTeamName(teamID, newTeamName);
    };

    const saveTeamName = async (teamID, newTeamName) => {
        try {
            const response = await fetch('http://localhost:1000/teams/updateTeamName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ TeamID: teamID, TeamName: newTeamName }),
            });
            if (!response.ok) throw new Error('Failed to update team name');
            // console.log(`Team name updated for ID: ${teamID}`);
        } catch (error) {
            console.error('Error updating team name:', error);
        }
    };

    const handleToggleEditing = (teamID) => {
        setTeams(prevTeams =>
            prevTeams.map(team =>
                team.id === teamID ? { ...team, isEditing: !team.isEditing } : team
            )
        );
    };


    const handleSaveGroup = async () => {
        if (groupName.trim() === '') {
            // console.log("Enter a group name");
            return;
        }

        const groupData = {
            GroupName: groupName,
            CreatorID: userData.UserID,
        };

        // console.log(groupData);

        try {
            const response = await fetch('http://localhost:1000/groups/createGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(groupData),
            });

            if (!response.ok) throw new Error('Failed to create group');

            const data = await response.json();

            setGroupID(data.GroupID);
            setGroupCreated(true);
            // console.log("Group created successfully. Group ID: " + data.GroupID);
        } catch (error) {
            console.error('Error saving group:', error);
        }
    };

    const handleAddTeam = async () => {
        if (newTeamName.trim() === '') {
            // console.log("Enter a team name");
            return;
        }
        if (!groupID) {
            // console.log("Create a group first.");
            return;
        }

        const teamData = {
            GroupID: groupID,
            TeamName: newTeamName,
        };

        try {
            const response = await fetch('http://localhost:1000/teams/createTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teamData),
            });

            if (!response.ok) throw new Error('Failed to create team');

            const data = await response.json();
            // console.log("TeamID: " + data.TeamID);
            setTeams(prevTeams => [...prevTeams, { id: data.TeamID, name: newTeamName }]);
            setNewTeamName('');
            // console.log("Team created successfully. Team: " + data.TeamID + " " + newTeamName);
        } catch (error) {
            console.error("Error creating team:", error);
            // console.log("Error creating team. Please try again.");
        }
    };

    const handleDeleteTeam = async (teamID) => {
        if (!teamID) {
            console.error("Invalid team ID.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:1000/teams/deleteTeam/${teamID}/${groupID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete team');
            }

            setTeams(prevTeams => prevTeams.filter(team => team.id !== teamID));
            // console.log("Team deleted successfully.");
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };

    return (
        <main className="create-group">
            <NavigationHeader />
            <div className='create-group__adding-groups'>
                <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '75ch' } }} noValidate autoComplete="off">
                    <TextField
                        className='custom-textfield'
                        id="groupName"
                        label="Group Name"
                        variant="outlined"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        onBlur={() => handleUpdateGroupName()} // Save when clicking outside
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevent form submission
                                handleUpdateGroupName(); // Save on Enter
                            }
                        }}
                    />
                </Box>
            </div>

            <div className="create-group__adding-teams">
                <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1, width: '75ch' } }}
                    noValidate
                    autoComplete="off"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddTeam();
                    }}
                >
                    <TextField
                        className='custom-textfield'
                        id="addEvalTeam"
                        label="Evaluation team name"
                        variant="outlined"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTeam();
                            }
                        }}
                    />
                </Box>
                <IconButton
                    icon={faPlus}
                    text="Add Team"
                    onClick={handleAddTeam}
                />
            </div>

            <div className="create-group__teams-table">
                <AddTeamsTable
                    teams={teams}
                    onDeleteTeam={handleDeleteTeam}
                    onEditTeam={(teamID, newTeamName) => handleEditTeamName(teamID, newTeamName)}
                    onToggleEditing={(teamID) => handleToggleEditing(teamID)}
                />
            </div>

            <div className='create-group__bottom-btn'>
                <IconButton
                    icon={faArrowRight}
                    text="Add Users"
                    onClick={() => navigate('/editgroup/editusers', { state: { groupID } })}
                />
            </div>
        </main>
    );
}

export default EditGroup;
