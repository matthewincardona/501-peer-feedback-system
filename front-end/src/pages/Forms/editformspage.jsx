import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import TemplateForm from '../../components/ui/TemplateForm';
import './style.css';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@mui/material';

function AddForm() {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { groupID } = location.state || {};
    console.log("GroupID", groupID);

    const [createdForms, setCreatedForms] = useState([]);

    // Retrieve startDate and endDate from location.state
    const startDate = location.state?.startDate || null;
    const endDate = location.state?.endDate || null;

    useEffect(() => { }, [startDate, endDate]);

    console.log("Start Date in AddForm:", startDate);
    console.log("End Date in AddForm:", endDate);

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

    return (
        <div>            
            <main className="addForm">
                <NavigationHeader />

                <div className="formBttns">
                    <AddNewFormBttn
                        className="addNewBttn"
                        onClick={() => navigate('/editgroup/editusers/editcreator/editdatepicker/editform/', {
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
        </div>
    );
}

export default AddForm;
