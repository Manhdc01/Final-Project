const { registerCustomerService, loginCustomerService } = require('../services/authService')

const registerCustomer = async (req, res) => {
    try {
        let { username, password, role } = req.body
        // Check input data
        if (!username || !password) {
            return res.status(400).json({ errorCode: 400, message: "Missing username or password" });
        }
        let registerData = {
            username,
            password,
            role
        }
        let register = await registerCustomerService(registerData)
        return res.status(200).json({
            errorCode: 0,
            data: register
        })
    } catch (error) {
        return res.status(500).json({
            errorCode: 500,
            message: "Internal server error"
        });
    }

}

const loginCustomer = async (req, res) => {
    try {
        let { username, password } = req.body;
        let account = await loginCustomerService(username, password);

        if (!account) {
            // User not found or password incorrect
            return res.status(404).json({
                errorCode: 404,
                message: "Wrong username or password"
            });
        }

        // Login success!
        return res.status(200).json({
            errorCode: 0,
            data: account
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errorCode: 500,
            message: "Internal server error"
        });
    }
}

module.exports = {
    registerCustomer, loginCustomer
}