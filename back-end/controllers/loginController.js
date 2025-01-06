const loginModel = require("../models/loginModel");

module.exports = {
    login: async(req, res) => {
        const userName = req.query.username;
        const password = req.query.password;

        try{
            const login = await loginModel.login(userName, password);
            res.status(200).json(login);
        } catch (err) {
            console.log("Error in login controller:", err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
}