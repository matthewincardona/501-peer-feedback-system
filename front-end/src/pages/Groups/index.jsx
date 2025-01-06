import React, { useState, useEffect } from 'react';
import GroupDropdown from '../../components/ui/GroupDropdown';
import GroupCard from '../../components/ui/GroupCard';
import NavigationHeader from '../../components/ui/NavigationHeader';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [selectedGroupID, setSelectedGroupID] = useState('');
  const [selectedTeamID, setSelectedTeamID] = useState(''); // Added state for selected team ID
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const formID = localStorage.getItem('selectedFormID');

  useEffect(() => {
    if (!formID) {
      navigate('/'); // Redirect to homepage if formID is missing
      return;
    }

    const fetchGroupsData = async () => {
      try {
        const response = await fetch(`http://localhost:1000/groups/${formID}`);
        const data = await response.json();
        // console.log("Fetched groups successfully:", data);
        setGroups(data || []);

        // Fetch teams for the first group and set the default group
        if (data && data.length > 0) {
          const defaultGroupID = data[0].GroupID;
          const defaultGroupName = data[0].GroupName;
          setSelectedGroupID(defaultGroupID);
          setSelectedGroupName(defaultGroupName);
          fetchTeamsData(defaultGroupID);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        alert("An error occurred while fetching groups.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsData();
  }, [formID, navigate]);

  const fetchTeamsData = async (groupId) => {
    try {
      // console.log(`Fetching teams for group ID: ${groupId}`);
      const response = await fetch(`http://localhost:1000/teams/${groupId}`);
      const data = await response.json();
      // console.log(`Fetched teams for group ${groupId} successfully:`, data);

      setTeams(data || []);
      if (data.length > 0) {
        setSelectedTeamID(data[0].TeamID); // Default to the first team of the group
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      alert("An error occurred while fetching teams.");
    }
  };

  const handleGroupSelect = (groupId) => {
    // console.log("Group selected:", groupId);
    const selectedGroup = groups.find(group => group.GroupID === groupId);
    if (selectedGroup) {
      setSelectedGroupName(selectedGroup.GroupName);
      setSelectedGroupID(groupId); // Update the selected group ID
      fetchTeamsData(groupId); // Fetch teams for the selected group
    }
  };

  const handleTeamSelect = (teamId) => {
    // console.log("Team selected:", teamId);
    setSelectedTeamID(teamId); // Update the selected team ID
  };

  return (
    <main className="groupsPage">
      <NavigationHeader />
      <div className="groupsPage__dropdown">
        {!loading && (
          <GroupDropdown groupListData={groups} onGroupSelect={handleGroupSelect} />
        )}
      </div>
      <div className="groupsPage__teams">
        <h4>{selectedGroupName}</h4>
        <GroupCard
          teamNames={teams}
          groupID={selectedGroupID}
          formID={formID}
          selectedTeamID={selectedTeamID} // Pass the selected team ID
          onTeamSelect={handleTeamSelect} // Callback for team selection
        />
      </div>
    </main>
  );
}

export default GroupsPage;
