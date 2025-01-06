import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "./GroupDropdown.css";

function GroupDropdown({ groupListData, onGroupSelect }) {
  const [selectedGroup, setSelectedGroup] = useState(groupListData[0]?.GroupID || '');

  const handleChange = (event) => {
    const groupId = event.target.value;
    setSelectedGroup(groupId);
    onGroupSelect(groupId); // Pass selected group ID to parent
  };

  return (
    <FormControl fullWidth className="groupDropdown">
      <InputLabel>Select a Group</InputLabel>
      <Select
        labelId="select_Label"
        id="dropDown_Select"
        value={selectedGroup}
        label="Select a Group"
        onChange={handleChange}
      >
        {groupListData.map((group) => (
          <MenuItem key={group.GroupID} value={group.GroupID}>
            {group.GroupName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default GroupDropdown;
