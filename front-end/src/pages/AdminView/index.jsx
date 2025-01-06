import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUserProfile } from '../../utils/getUserProfile';
import {
  faMagnifyingGlass,
  faUsers,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import './styles.css';

const ACCESS_LEVELS = ['User', 'Creator', 'Admin'];

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [accessLevel, setAccessLevel] = useState(null);

  useEffect(() => {
    const fetchUserAccessLevel = async () => {
      const userProfile = await getUserProfile();
      if (userProfile) {
        setAccessLevel(userProfile.AccessLevel);
      } else {
        console.error("Failed to fetch user profile.");
        alert("Unable to load admin privileges. Redirecting...");
        handleLogout();
      }
    };

    fetchUserAccessLevel();
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:1000/users/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map(user => ({
          ...user,
          id: user.UserID // DataGrid requires an id field
        }));
        setUsers(formattedData);
        setFilteredUsers(formattedData);
      } else {
        console.error("Failed to fetch users");
        alert("An error occurred while fetching users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccessLevel = async (userId, newAccessLevel) => {
    console.log("Updating user:", userId, "to access level:", newAccessLevel);

    try {
      const response = await fetch(`http://localhost:1000/users/access-level`, {
        method: 'POST', // Using POST since our endpoint was designed as POST
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID: userId, newAccessLevel }) // Adjusted request payload
      });

      if (response.ok) {
        const updatedUsers = users.map(user =>
          user.UserID === userId ? { ...user, AccessLevel: newAccessLevel } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setEditingUser(null); // Exit edit mode

        alert("User access level successfully update!");
      } else {
        const errorData = await response.json();
        console.error("Failed to update access level:", errorData);
        alert("An error occurred while updating the user's access level.");
      }
    } catch (error) {
      console.error("Error updating access level:", error);
      alert("An error occurred while updating the user's access level.");
    }
  };

  const handleSearchInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchUsername(searchTerm);

    if (searchTerm.trim() === '') {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      setFilteredUsers(users);
      return;
    }

    const suggestions = users.filter(user =>
      user.UserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.FirstName && user.FirstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.LastName && user.LastName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setSearchSuggestions(suggestions);
    setShowSuggestions(true);
    setFilteredUsers(suggestions);
  };

  const handleSuggestionClick = (user) => {
    setSearchUsername(user.UserName);
    setFilteredUsers([user]);
    setShowSuggestions(false);
  };

  const columns = [
    { field: 'UserID', headerName: 'User ID', width: 100 },
    { field: 'UserName', headerName: 'Username', width: 150 },
    { field: 'FirstName', headerName: 'First Name', width: 150 },
    { field: 'LastName', headerName: 'Last Name', width: 150 },
    {
      field: 'AccessLevel',
      headerName: 'Access Level',
      width: 200,
      renderCell: (params) => {
        const isEditing = editingUser === params.row.UserID;

        return isEditing ? (
          <Select
            value={params.row.AccessLevel}
            onChange={(e) => handleUpdateAccessLevel(params.row.UserID, e.target.value)}
            size="small"
            className="access-level-select"
          >
            {ACCESS_LEVELS.map(level => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {params.value}
            <IconButton
              size="small"
              onClick={() => setEditingUser(params.row.UserID)}
              style={{ color: '#F76902' }}
            >
              <FontAwesomeIcon icon={faEdit} />
            </IconButton>
          </div>
        );
      }
    }
  ];

  if (accessLevel !== 'Admin') {
    return (
      <main className="noPermissionPage">
        <h4>You don't have permission to view this page.</h4>
        <a href="/">
          Back To Dashboard
        </a>
      </main >
    );
  }

  return (
    <main className="adminPage">
      <NavigationHeader />

      <div className="adminPage__title">
        <FontAwesomeIcon icon={faUsers} size="lg" />
        <h4>User Management</h4>
      </div>

      <div className="adminPage__actions">
        <div className="adminPage__panel">
          <div className="panel__header">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <h5>Search Users</h5>
          </div>
          <div className="panel__content">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by username, first name, or last name"
                value={searchUsername}
                onChange={handleSearchInputChange}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {searchSuggestions.map((user, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(user)}
                    >
                      {user.UserName} - {user.FirstName} {user.LastName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setFilteredUsers(searchSuggestions)} className="search-button">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Updated DataGrid Component */}
      <div className="adminPage__table">
        <h5 className="table-title">User List</h5>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          loading={loading}
          autoHeight
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#F76902',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-row': {
              backgroundColor: '#f2f2f2',
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: '#e0e0e0',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
            }
          }}
        />
      </div>
    </main>
  );
}

export default AdminPage;