import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import NavigationHeader from '../../components/ui/NavigationHeader';
import IconButton from '../../components/ui/IconButton';
import '../FormDatePicker/style.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function EditFormDatePicker() {
    const navigate = useNavigate();
    const location = useLocation();
    const { groupID } = location.state || {}; // Extract groupID from location.state
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const formID = localStorage.getItem('formID'); // Retrieve form ID from local storage

    useEffect(() => {
        if (formID) {
            fetchFormDates(formID);
        } else {
            console.error("Form ID is missing in local storage.");
        }
    }, [formID]);

    const fetchFormDates = async (formID) => {
        try {
            const response = await fetch(`http://localhost:1000/forms/id/${formID}`);
            if (!response.ok) {
                throw new Error("Failed to fetch form data");
            }

            const data = await response.json();
            const formDetails = data.result[0];

            if (formDetails) {
                setStartDate(dayjs(formDetails.Assigned)); // Set Assigned date
                setEndDate(dayjs(formDetails.Deadline)); // Set Deadline
                console.log("Assigned:", formDetails.Assigned);
                console.log("Deadline:", formDetails.Deadline);
            } else {
                console.error("No form details found in the response.");
            }
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };

    const handleStartDateChange = (date) => {
        if (date) {
            setStartDate(date.startOf('day'));
            console.log("Start Date selected:", date.format('YYYY-MM-DD HH:mm:ss'));
        } else {
            setStartDate(null);
            console.log("Start Date selected: No date");
        }
    };

    const handleEndDateChange = (date) => {
        if (date) {
            setEndDate(date.startOf('day'));
            console.log("End Date selected:", date.format('YYYY-MM-DD HH:mm:ss'));
        } else {
            setEndDate(null);
            console.log("End Date selected: No date");
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

        const formattedStartDate = startDate.format('YYYY-MM-DD HH:mm:ss');
        const formattedEndDate = endDate.format('YYYY-MM-DD HH:mm:ss');

        console.log("Navigating with Start Date:", formattedStartDate);
        console.log("Navigating with End Date:", formattedEndDate);
        console.log("Group ID:", groupID);

        navigate('/editgroup/editusers/editcreator/editdatepicker/editnewform', {
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
                        <p style={{ marginTop: '20px' }}>
                            Your form will open on {startDate.format('YYYY-MM-DD')}, at <strong>12am.</strong>
                        </p>
                    )}

                    {endDate && (
                        <p>
                            And will stop accepting responses after {endDate.format('YYYY-MM-DD')}, at <strong>midnight.</strong>
                        </p>
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

export default EditFormDatePicker;
