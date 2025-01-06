import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "./ResponderDropdown.css";

function ResponderDropdown({ assignments, selectedAssignmentID, onAssignmentSelect }) {
  const handleChange = (event) => {
    const newSelection = event.target.value;
    // console.log('Dropdown selection changed:', newSelection); // Debugging statement
    onAssignmentSelect(newSelection);
  };

  return (
    <FormControl fullWidth className="responderDropdown">
      <InputLabel id="select_Label">Select a Teammate to Review</InputLabel>
      <Select
        labelId="select_Label"
        id="dropDown_Select"
        value={selectedAssignmentID || ''}  // Display empty initially
        label="Select a Teammate to Review"
        onChange={handleChange}
      >
        {/* Placeholder option */}
        <MenuItem value="">
          <em>Select a teammate</em>
        </MenuItem>
        {assignments.map((assignment) => (
          <MenuItem key={assignment.Reviewee} value={assignment.Reviewee}>
            {assignment.RevieweeName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ResponderDropdown;
