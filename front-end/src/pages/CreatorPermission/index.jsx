import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import NavigationHeader from '../../components/ui/NavigationHeader';
import IconButton from '../../components/ui/IconButton';
import CreatorTable from '../../components/ui/CreatorTable';

import './style.css';

function Creator() {
    const navigate = useNavigate();
    const location = useLocation();
    const { groupID: groupIDFromState } = location.state || {};
    const [groupID, setGroupID] = useState(groupIDFromState || localStorage.getItem('groupID'));
    const [groupName, setGroupName] = useState('');
    const [creators, setCreators] = useState([]);

    useEffect(() => {
        if (groupID) {
            localStorage.setItem('groupID', groupID); // Update local storage in case it's initially from state
            fetchGroupName(groupID);
            fetchCreators(groupID);
        } else {
            console.error('No groupID available.');
        }
    }, [groupID]);

    const fetchGroupName = async (groupID) => {
        try {
            const response = await fetch(`http://localhost:1000/groups/groupname/${groupID}`);
            if (!response.ok) throw new Error('Failed to fetch group name');

            const data = await response.json();
            setGroupName(data.GroupName);
        } catch (error) {
            console.error("Error fetching group name:", error);
        }
    };

    const fetchCreators = async (groupID) => {
        try {
            const response = await fetch(`http://localhost:1000/users/getCreators/${groupID}`);
            if (!response.ok) throw new Error('Failed to fetch Creators');

            const data = await response.json();

            const creatorsWithPermissions = data.map(user => ({
                ...user,
                permissions: user.permissions || {
                    canSeeResponses: true,
                    canViewGroup: true,
                    canEditForm: true,
                    canDeleteForm: true,
                }
            }));

            setCreators(creatorsWithPermissions);
        } catch (error) {
            console.error("Error fetching creators:", error);
        }
    };

    return (
        <main className="creator">
            <NavigationHeader />

            <h2 className='creator__group-name-title'>Group: {groupName}</h2>
            <h3>Creator Permissions</h3>
            <div className='creator__creatorTable'>
                <CreatorTable users={creators} setUsers={setCreators} groupID={groupID} />
            </div>
            <div className='creator__bottom-btn'>
                <IconButton
                    className='createGrpBttn'
                    icon={faArrowRight}
                    text="Date Picker"
                    onClick={() => {
                        if (groupID) {
                            navigate('/creategroup/addusers/creator/datepicker', {
                                state: { groupID }
                            });
                        } else {
                            console.error('No groupID to pass to the next page.');
                            alert('Group ID is missing.');
                        }
                    }}
                />
            </div>
        </main>
    );
}

export default Creator;
