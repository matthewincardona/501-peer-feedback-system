import React, { useState, useEffect } from 'react';
import UserTable from '../../components/ui/UserTable';
import ResponseLabel from '../../components/ui/ResponseLabel';
import NavigationHeader from '../../components/ui/NavigationHeader';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import './styles.css';

function TeamsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const teamID = localStorage.getItem('selectedTeamID');
    const storedGroupID = localStorage.getItem('selectedGroupID'); // Retrieve GroupID

    if (!teamID || !storedGroupID) {
      navigate('/'); // Redirect to homepage if IDs are missing
      return;
    }

    const fetchTeamName = async () => {
      try {
        console.log("Fetching team name with groupID:", storedGroupID, "teamID:", teamID);
        const response = await fetch(`http://localhost:1000/teams/teamName?groupID=${storedGroupID}&teamID=${teamID}`);
        const data = await response.json();

        if (data.TeamName) {
          setTeamName(data.TeamName);
        } else {
          console.error("Error from backend:", data.error || "Unknown error");
          setTeamName('Unnamed Team');
        }
      } catch (error) {
        console.error("Error fetching team name:", error);
        alert("An error occurred while fetching the team name.");
        setTeamName('Unnamed Team');
      }
    };

    const fetchUsersData = async () => {
      try {
        const response = await fetch(`http://localhost:1000/teams/users?teamID=${teamID}`);
        const data = await response.json();
        const transformedUsers = data.map(user => ({
          userID: user.UserID,
          name: user.Name,
          username: user.UserName,
          status: user.Submitted === 1 ? 'Responded' : 'Not Responded'
        }));
        setUsers(transformedUsers || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamName();
    fetchUsersData();
  }, [navigate]);

  return (
    <main className="teamsPage">
      <NavigationHeader />

      <div className="teamsPage__title">
        <FontAwesomeIcon icon={faUser} size="lg" />
        <h4>
          Team: {teamName}
        </h4>
      </div>

      <ResponseLabel
        labelText="Responses"
        num1="18"
        num2="22"
      />

      <div>
        {!loading && <UserTable users={users} />}
      </div>
    </main>
  );
}

export default TeamsPage;
