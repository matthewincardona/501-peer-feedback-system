import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import IconButton from '../../components/ui/IconButton';
import AddTeamsTable from '../../components/ui/AddTeamsTable';
import { faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function CreateGroup() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = location.state || {};
    const creatorID = userData.UserID;

    const [groupName, setGroupName] = useState(() => localStorage.getItem('groupName') || '');
    const [groupID, setGroupID] = useState(() => localStorage.getItem('groupID') || null);
    const [groupCreated, setGroupCreated] = useState(!!groupID);
    const [teams, setTeams] = useState(() => {
        const savedTeams = localStorage.getItem('teams');
        return savedTeams ? JSON.parse(savedTeams) : [];
    });
    const [newTeamName, setNewTeamName] = useState('');

    useEffect(() => {
        if (groupName) localStorage.setItem('groupName', groupName);
    }, [groupName]);

    useEffect(() => {
        if (groupID) localStorage.setItem('groupID', groupID);
    }, [groupID]);

    useEffect(() => {
        localStorage.setItem('teams', JSON.stringify(teams));
    }, [teams]);

    const handleSaveGroup = async () => {
        if (groupName.trim() === '') return;

        const groupData = {
            GroupName: groupName,
            CreatorID: userData.UserID,
        };

        try {
            const response = await fetch('http://localhost:1000/groups/createGroup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(groupData),
            });

            if (!response.ok) throw new Error('Failed to create group');

            const data = await response.json();
            setGroupID(data.GroupID);
            setGroupCreated(true);
        } catch (error) {
            console.error('Error saving group:', error);
        }
    };

    const handleAddTeam = async () => {
        if (newTeamName.trim() === '' || !groupID) return;

        const teamData = {
            GroupID: groupID,
            TeamName: newTeamName,
        };

        try {
            const response = await fetch('http://localhost:1000/teams/createTeam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teamData),
            });

            if (!response.ok) throw new Error('Failed to create team');

            const data = await response.json();
            setTeams(prevTeams => [...prevTeams, { id: data.TeamID, name: newTeamName }]);
            setNewTeamName('');
        } catch (error) {
            console.error("Error creating team:", error);
        }
    };

    const handleUpdateGroupName = async () => {
        if (groupName.trim() === '' || !groupID) return;

        try {
            const response = await fetch('http://localhost:1000/groups/updateGroupName', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ GroupID: groupID, GroupName: groupName }),
            });

            if (!response.ok) throw new Error('Failed to update group name');
        } catch (error) {
            console.error('Error updating group name:', error);
        }
    };

    const handleDeleteTeam = async (teamID) => {
        if (!teamID) return;
        try {
            const response = await fetch(`http://localhost:1000/teams/deleteTeam/${teamID}/${groupID}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to delete team');

            setTeams(prevTeams => prevTeams.filter(team => team.id !== teamID));
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };

    const handleAddUsers = () => {
        if (teams.length === 0) {
            alert("Please add at least one team before proceeding.");
            return;
        }

        navigate('/creategroup/addusers', { state: { groupID, creatorID } });
    };

    return (
        <main className="create-group">
            <NavigationHeader />
            <div className='create-group__adding-groups'>
                <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1, width: '75ch' } }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        className='custom-textfield'
                        id="groupName"
                        label="Group Name"
                        variant="outlined"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                groupID ? handleUpdateGroupName() : handleSaveGroup();
                            }
                        }}
                    />
                </Box>
                <IconButton
                    className='create-group__icon-button'
                    icon={faPlus}
                    text="Add Group"
                    onClick={() => groupID ? handleUpdateGroupName() : handleSaveGroup()}
                />
            </div>

            {groupCreated && (
                <div className='create-group__adding-teams'>
                    <Box
                        component="form"
                        sx={{ '& > :not(style)': { m: 1, width: '75ch' } }}
                        noValidate
                        autoComplete="off"
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
                        className='create-group__icon-button'
                        icon={faPlus}
                        text="Add Team"
                        onClick={handleAddTeam}
                    />
                </div>
            )}
            {groupCreated && (
                <div className="create-group__teams-table">
                    <AddTeamsTable
                        teams={teams}
                        onDeleteTeam={handleDeleteTeam}
                    />
                </div>
            )}
            <div className='create-group__bottom-btn'>
                {groupCreated && (
                    <IconButton
                        className='create-group__icon-button'
                        icon={faArrowRight}
                        text="Add Users"
                        onClick={handleAddUsers}
                        disabled={teams.length === 0} 
                    />
                )}
            </div>
        </main>
    );
}

export default CreateGroup;
