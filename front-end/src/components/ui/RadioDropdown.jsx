import React from 'react';
import { Radio, FormControlLabel, Typography } from '@mui/material';

const ReviewSelection = ({ type, options }) => {
  return (
    <div className="review-selection">
      <Typography variant="h6" className="review-type">
        {type}
      </Typography>
      {options.map((option, index) => (
        <FormControlLabel
          key={index}
          value={option}
          control={<Radio />}
          label={option}
          className="review-option"
        />
      ))}
    </div>
  );
};

export default ReviewSelection;