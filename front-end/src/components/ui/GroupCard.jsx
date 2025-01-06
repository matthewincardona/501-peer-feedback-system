import React from 'react';
import { faUser } from "@fortawesome/free-regular-svg-icons";
import IconButton from "./IconButton";
import ResponseLabel from '../../components/ui/ResponseLabel';
import { useNavigate } from 'react-router-dom';
import "./GroupCard.css";

function GroupCard({ teamNames, groupID }) {
  const navigate = useNavigate();

  const handleViewTeamsClick = (teamID) => {
    localStorage.setItem('selectedTeamID', teamID); // Store selected TeamID
    localStorage.setItem('selectedGroupID', groupID); // Store selected GroupID
    navigate('/groups/teams');
  };

  return (
    <div className="groupCard">
      <div className="groupCard__labels">
        <ResponseLabel
          labelText="Responses"
          num1="18"
          num2="22"
        />
      </div>

      <div className="groupCard__teamContainers">
        {teamNames.map((team) => (
          <div key={team.TeamID}>
            <IconButton
              icon={faUser}
              text={team.TeamName}
              onClick={() => handleViewTeamsClick(team.TeamID)} // Pass TeamID
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupCard;
