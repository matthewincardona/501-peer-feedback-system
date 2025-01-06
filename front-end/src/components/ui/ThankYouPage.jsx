// ThankYouPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./thankYouPage.css"; // Optional: Add custom styles

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <div className="thank-you-message">
      <h1>Thank You!</h1>
      <p>Your form has been successfully created.</p>
      <button className="back-dashboard" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default ThankYouPage;
