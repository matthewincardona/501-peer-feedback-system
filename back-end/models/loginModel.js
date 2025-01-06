const db = require('../services/connectToDB');

module.exports = {

    login: async (userName, password) => {
        const query = 'SELECT UserName, Password, AccessLevel From User WHERE UserName =?';

        try{
            const [results] = await db.execute(query, [userName]);

           

            if(results.length === 0){
                return { message: 'Invalid Username'};
            }
            
            const storedPw = results[0].Password;
            
            if(storedPw === password){
                return { message: 'Login successful', user: results[0].UserName, AccessLevel: results[0].AccessLevel};
            }else {
                return { message: 'Invalid Password'};
            }
        } catch (err){
            console.error(err);
            throw new Error('An error occurred during login');
        }
        
    }
}