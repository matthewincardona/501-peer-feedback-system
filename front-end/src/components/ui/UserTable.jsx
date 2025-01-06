import React from 'react';
import "./UserTable.css"
import { faPlus, faDatabase, faMinus } from '@fortawesome/free-solid-svg-icons';
import IconButton from './IconButton';
import { useNavigate } from "react-router-dom";

function UserTable({ users }) {
    // // console.log(users);

    const navigate = useNavigate(); // Initialize navigate function

    const handleViewResponsesClick = (selectedUserID) => {
        localStorage.setItem('selectedUserID', selectedUserID);
        navigate('/groups/teams/results');
    };

    return (
        <div className="userTable">
            <div className="userTable__headers">
                <p><strong>Team Members</strong></p>
                {/* <p><strong>Status</strong></p> */}
            </div>
            {users.map((user, index) => (
                <div className="userTable__user" key={index}>
                    <p className='userTable__userName' onClick={() => handleViewResponsesClick(user.userID)} role='link'>{user.name}</p>
                    {/* <p className={user.status === 'Not Responded' ? 'userTable__user--notResponded' : ''}> */}
                    {/* {user.status} */}
                    {/* </p> */}
                </div>
            ))
            }
            {/* <div className='userTable__buttonRow'>
                <IconButton
                    icon={faDatabase}
                    text="View Data"
                />
                <IconButton
                    icon={faPlus}
                    text="Add User"
                />
                <IconButton
                    icon={faMinus}
                    text="Remove User"
                />
            </div> */}
        </div >
    );
}

export default UserTable;

// Example of how to call it
// const users = [
//     { name: 'Alice', status: 'Responded' },
//     { name: 'Bob', status: 'Not Responded' },
//     { name: 'Charlie', status: 'Not Responded' }
//   ];

// return (
//     <div>
//         <h1>User Responses</h1>
//         <UserTable users={users} />
//     </div>
// );