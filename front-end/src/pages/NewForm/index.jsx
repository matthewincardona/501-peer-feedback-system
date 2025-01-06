import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NavigationHeader from '../../components/ui/NavigationHeader';
import Form from "./Form.jsx";

function NewForm() {

    return (
        <main className="newForm">
            <NavigationHeader />

            {/* Page Content */}

            {/* new form */}
            <Form />

        </main>
    );
}

export default NewForm;