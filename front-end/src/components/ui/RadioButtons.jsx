import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

function RadioButtons({ onChange }) {
    // Handles the selection of a radio button and calls the onChange prop
    const handleChange = (event) => {
        onChange(event.target.value); // Pass the selected person to the parent component
    };

    return (
        <FormControl>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="April O’Neil"
                name="radio-buttons-group"
                onChange={handleChange} // Trigger the handleChange function on selection
            >
                {/* Radio options for different reviewers */}
                <FormControlLabel value="April O’Neil" control={<Radio />} label="April O’Neil" />
                <FormControlLabel value="Splinter" control={<Radio />} label="Splinter" />
                <FormControlLabel value="Bruce Willis" control={<Radio />} label="Bruce Willis" />
            </RadioGroup>
        </FormControl>
    );
}

export default RadioButtons;
