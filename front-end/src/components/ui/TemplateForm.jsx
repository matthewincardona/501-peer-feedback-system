import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./TemplateForm.css";


function TemplateForm({ formData}) {
    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
        // TODO: pull forms in the database
        alert(`Clicked on: ${formData.title}`);
    };

    return (
        <div className={`templateForm ${isActive ? 'active' : ''}`} 
        onClick={handleClick} 
        onMouseDown={() => setIsActive(true)} 
        onMouseUp={() => setIsActive(false)} 
        onMouseLeave={() => setIsActive(false)}
        >
            <h4>{formData.title}</h4>
            <p>{formData.descr}</p>
        </div>
    );
}

export default TemplateForm;