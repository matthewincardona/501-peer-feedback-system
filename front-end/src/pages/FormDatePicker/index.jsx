import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import NavigationHeader from '../../components/ui/NavigationHeader';
import IconButton from '../../components/ui/IconButton';
import './style.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function FormDatePicker() {
    const navigate = useNavigate();
    const location = useLocation();
    const { groupID } = location.state || {}; // Extract groupID from location.state
    // console.log("GroupID", groupID);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (date) => {
        if (date) {
            const formattedDate = date.startOf('day');
            setStartDate(formattedDate);
            // console.log("Start Date selected:", formattedDate.format('YYYY-MM-DD HH:mm:ss'));
        } else {
            setStartDate(null);
            // console.log("Start Date selected: No date");
        }
    };

    const handleEndDateChange = (date) => {
        if (date) {
            const formattedDate = date.startOf('day');
            setEndDate(formattedDate);
            // console.log("End Date selected:", formattedDate.format('YYYY-MM-DD HH:mm:ss'));
        } else {
            setEndDate(null);
            // console.log("End Date selected: No date");
        }
    };

    const handleCreateFormClick = () => {
        if (!startDate || !endDate) {
            alert("Please select both a start date and an end date.");
            return;
        }
        if (!groupID) {
            console.error('Group ID is missing.');
            alert('Group ID is required to proceed.');
            return;
        }

        const formattedStartDate = startDate ? startDate.format('YYYY-MM-DD HH:mm:ss') : null;
        const formattedEndDate = endDate ? endDate.format('YYYY-MM-DD HH:mm:ss') : null;

        // console.log("Navigating with Start Date:", formattedStartDate);
        // console.log("Navigating with End Date:", formattedEndDate);
        // console.log("Group ID:", groupID);

        navigate('/creategroup/addusers/creator/datepicker/form', {
            state: { startDate: formattedStartDate, endDate: formattedEndDate, groupID }
        });
    };

    return (
        <main className="form-date-picker">
            <NavigationHeader />

            {/* Page Content */}
            <div className="calendarContent">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className="custom-date-picker"
                    />
                </LocalizationProvider>


                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        className="custom-date-picker"
                    />
                </LocalizationProvider>

                <div>
                    {startDate && (
                        <p style={{ marginTop: '20px' }}>Your form will open on {startDate.format('YYYY-MM-DD')}, at <strong>12am.</strong></p>
                    )}

                    {endDate && (
                        <p style={{}}>And will stop accepting responses after {endDate.format('YYYY-MM-DD')}, at <strong>midnight.</strong></p>
                    )}
                </div>
            </div>

            <div className="bottomBttn">
                <IconButton
                    className="createGrpBttn"
                    icon={faArrowRight}
                    text="Create Form"
                    onClick={handleCreateFormClick}
                />
            </div>
        </main>
    );
}

export default FormDatePicker;
