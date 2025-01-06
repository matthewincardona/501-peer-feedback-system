// /Users/matthewincardona/Documents/Dev/Temp/ISTE-500-GroupNameNotFound/back-end/middleware/getUseProfile.js

// Use dynamic import() for node-fetch
async function getUserProfile() {
    const fetch = (await import('node-fetch')).default;  // Dynamically import node-fetch

    try {
        // Fetch user profile data
        const profileResponse = await fetch('http://localhost:1000/profile', {
            method: 'GET',
            credentials: 'include',
        });

        if (!profileResponse.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const profileData = await profileResponse.json();

        if (!profileData.nickname) {
            throw new Error('Nickname not found in profile data');
        }

        const nickname = profileData.nickname;
        // localStorage.setItem('user', JSON.stringify(nickname));

        // Fetch user access level using the nickname
        const accessResponse = await fetch(
            `http://localhost:1000/users/username/${nickname}`,
            {
                method: 'GET',
                credentials: 'include',
            }
        );

        if (!accessResponse.ok) {
            throw new Error('Failed to fetch access level data');
        }

        const accessData = await accessResponse.json();

        if (!accessData.AccessLevel) {
            throw new Error('AccessLevel not found in user data');
        }

        const accessLevel = accessData.AccessLevel;
        // localStorage.setItem('accessLevel', accessLevel);

        return {
            ...accessData, // Return all user data from the second fetch
        };
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        return null; // Handle errors gracefully
    }
}

module.exports = getUserProfile;
