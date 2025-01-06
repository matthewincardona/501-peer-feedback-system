const getUserProfile = require('./getUserProfile'); // Import the utility function

// Middleware to check if user has one of the required access levels
const checkAccessLevel = (allowedAccessLevels) => {
    return async (req, res, next) => {
        if (!req.oidc.isAuthenticated()) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        try {
            // Get user profile data (including access level)
            const userProfile = await getUserProfile(req);

            if (userProfile && allowedAccessLevels.includes(userProfile.AccessLevel)) {
                next(); // User has one of the correct access levels, proceed to the route
            } else {
                res.status(403).json({ message: 'Forbidden: Insufficient access level' });
            }
        } catch (error) {
            console.error('Error checking access level:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};

module.exports = checkAccessLevel;
