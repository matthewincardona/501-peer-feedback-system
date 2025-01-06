import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import Tabs from '../../components/ui/Tabs';
import FormCard from '../../components/ui/FormCard';
import IconButton from '../../components/ui/IconButton';
import NavigationHeader from '../../components/ui/NavigationHeader';
import { getUserProfile } from '../../utils/getUserProfile';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  faChessKing,
} from "@fortawesome/free-regular-svg-icons";
import './styles.css';

// Pagination constants
const ITEMS_PER_PAGE = 6;

// Format ISO date strings for display
function formatDateTime(isoDateString) {
  const date = new Date(isoDateString);
  const datePart = date.toLocaleDateString('en-US');
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return `${datePart} ${timePart}`;
}

function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [pendingForms, setPendingForms] = useState([]);
  const [createdForms, setCreatedForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [createdPage, setCreatedPage] = useState(1);
  const navigate = useNavigate();

  // Clear localStorage data on component load
  useEffect(() => {
    const clearLocalStorage = () => {
      localStorage.removeItem('groupID');
      localStorage.removeItem('groupName');
      localStorage.removeItem('selectedFormID');
      localStorage.removeItem('teams');
    };

    clearLocalStorage(); // Clear data when component loads

    const initializeDashboard = async () => {
      try {
        const userProfile = await getUserProfile();
        if (userProfile) {
          setUserData(userProfile);
          await fetchFormData(userProfile);
        } else {
          console.error('Failed to load user profile.');
          alert('Unable to load user profile. Please check your connection.');
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      }
    };

    initializeDashboard();
  }, []);

  const fetchFormData = async (userData) => {
    if (!userData.UserID) {
      console.error('UserID is missing from userData.');
      return;
    }

    try {
      const pendingResponse = await fetch(
        `http://localhost:1000/forms/user/${userData.UserID}`
      );
      const pendingData = await pendingResponse.json();
      const filteredPendingData = pendingData.filter(
        (form) => form.CreatorID !== userData.UserID
      );

      setPendingForms(filteredPendingData.reverse() || []);

      const createdResponse = await fetch(
        `http://localhost:1000/forms/creator/${userData.UserID}`
      );
      const createdData = await createdResponse.json();

      const uniqueCreatedData = createdData.reduce((acc, current) => {
        const isDuplicate = acc.some((form) => form.FormID === current.FormID);
        if (!isDuplicate) acc.push(current);
        return acc;
      }, []);
      setCreatedForms(uniqueCreatedData.reverse() || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (formID) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        const response = await fetch(`http://localhost:1000/forms/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formID }),
        });

        if (response.ok) {
          setPendingForms((prevForms) =>
            prevForms.filter((form) => form.FormID !== formID)
          );
          setCreatedForms((prevForms) =>
            prevForms.filter((form) => form.FormID !== formID)
          );
          alert('Form deleted successfully.');
        } else {
          alert('Failed to delete the form. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting form:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCreatedPageChange = (event, value) => {
    setCreatedPage(value);
  };

  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const paginatedPendingForms = getPaginatedData(pendingForms, currentPage);
  const paginatedCreatedForms = getPaginatedData(createdForms, createdPage);

  const tabs = [
    {
      label: 'Pending Forms',
      content: paginatedPendingForms.length > 0 ? (
        paginatedPendingForms.map((form) => (
          <FormCard
            key={form.FormID}
            formData={{
              ...form,
              Assigned: formatDateTime(form.Assigned),
              Deadline: formatDateTime(form.Deadline),
            }}
            isMyForm={false}
            isCompleted={form.FormCompleted}
            currentUserID={userData?.UserID} // Pass UserID
          />
        ))
      ) : (
        <p>No pending forms available.</p>
      ),
    },
  ];

  if (userData && (userData.AccessLevel === 'Creator' || userData.AccessLevel === 'Admin')) {
    tabs.unshift({
      label: "My Created Forms",
      content: paginatedCreatedForms.length > 0 ? (
        paginatedCreatedForms.map((form) => (
          <FormCard
            key={form.FormID}
            formData={{
              ...form,
              Assigned: formatDateTime(form.Assigned),
              Deadline: formatDateTime(form.Deadline),
            }}
            isMyForm={true}
            isCompleted={false}
            onDelete={() => handleDeleteForm(form.FormID)}
            currentUserID={userData?.UserID} // Pass UserID
          />
        ))
      ) : (
        <p>No created forms available.</p>
      ),
    });
  }

  return (
    <main className="dashboardPage">
      <NavigationHeader />
      <div className="dashboardPage__tabs">
        {!loading ? (
          <>
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
            {userData && (userData.AccessLevel === 'Admin' || userData.AccessLevel === 'Creator') && (
              <IconButton
                text="Create Form"
                icon={faPlus}
                onClick={() =>
                  navigate('/creategroup', { state: { userData } })
                }
              />
            )}
          </>
        ) : (
          <p>Loading forms...</p>
        )}
      </div>
      {!loading && (
        <div className="pagination-container">
          {activeTab === 1 && (
            <Pagination
              count={Math.ceil(pendingForms.length / ITEMS_PER_PAGE)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          )}
          {activeTab === 0 && (
            <Pagination
              count={Math.ceil(createdForms.length / ITEMS_PER_PAGE)}
              page={createdPage}
              onChange={handleCreatedPageChange}
              color="primary"
            />
          )}
        </div>
      )}
      {userData && userData.AccessLevel === 'Admin' && (
        <a href="/adminview">
          <button className="dashboardPage__adminViewBtn">
            <FontAwesomeIcon icon={faChessKing} size="lg" />
            <p>Admin</p>
          </button>
        </a>
      )}
    </main>
  );
}

export default DashboardPage;
