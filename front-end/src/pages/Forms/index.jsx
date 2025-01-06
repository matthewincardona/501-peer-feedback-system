import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate
import NavigationHeader from '../../components/ui/NavigationHeader';
import TemplateForm from '../../components/ui/TemplateForm';
import './style.css';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@mui/material';

function AddForm() {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook
    const location = useLocation();
    const { groupID } = location.state || {};
    // console.log("GroupID", groupID);

    const [createdForms, setCreatedForms] = useState([]);

    // Retrieve startDate and endDate from location.state
    const startDate = location.state?.startDate || null;
    const endDate = location.state?.endDate || null;

    // Log startDate and endDate whenever AddForm mounts or these values change
    useEffect(() => {
        // console.log("Start Date in AddForm:", startDate);
        // console.log("End Date in AddForm:", endDate);
    }, [startDate, endDate]);

    // Custom button styling
    const AddNewFormBttn = styled(Button)({
        boxShadow: '3px 6px 12px rgba(0, 0, 0, 0.15)',
        color: 'var(--Color-Text-gray-300)',
        border: '1px solid var(--Color-Text-gray-100, #e9ecef)',
        width: '350px',
        height: '230px',
        margin: '8px',
        '&:hover': {
            backgroundColor: '#ffffff',
            borderColor: '#f76902',
            boxShadow: '3px 12px 24px rgba(0, 0, 0, 0.1)',
        },
        '&:active': {
            backgroundColor: '#D0D3D4',
            borderColor: '#000000',
            boxShadow: '3px 6px 12px rgba(0, 0, 0, 0.15)',
        }
    });

    // useEffect(() => {
    //     const fetchFormData = async () => {
    //         try {
    //             // Fetch Created Forms if user is a creator
    //             const createdResponse = await fetch('http://localhost:1000/forms/creator/1', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //             });
    //             const createdData = await createdResponse.json();
    //             setCreatedForms(createdData || []);
    //         } catch (error) {
    //             console.error("Error fetching forms:", error);
    //             alert("An error occurred while fetching forms.");
    //         } finally {
    //             // setLoading(false);
    //         }
    //     };
    //     fetchFormData();

    // }, []);

    return (
        <main className="addForm">
            <NavigationHeader />

            <div className="formBttns">
                <AddNewFormBttn
                    className="addNewBttn"
                    onClick={() => navigate('/creategroup/addusers/creator/datepicker/newform/', {
                        state: { groupID, startDate, endDate }
                    })}
                >
                    <FontAwesomeIcon
                        icon={faPlus}
                        size="8x"
                        style={{ color: (isActive ? "#000000" : "#f76902") }}
                    />
                </AddNewFormBttn>

                {createdForms.map((form) => (
                    <TemplateForm
                        key={form.FormID}
                        formData={form}
                    />
                ))}
            </div>
        </main>
    );
}

export default AddForm;
