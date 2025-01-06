export const getUserProfile = async () => {
  try {
    const profileResponse = await fetch('http://localhost:1000/profile', {
      method: 'GET',
      credentials: 'include', // This is crucial for sending cookies
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
        credentials: 'include', // Ensure credentials are included in this request
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
    return null;
  }
};
