const { registerCustomerService, loginCustomerService, requestAccessTokenService, logOutCustomerService } = require('../services/authService')

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
        const { accessToken, refreshToken, account } = await loginCustomerService(username, password);

        if (!account) {
            // User not found or password incorrect
            return res.status(404).json({
                errorCode: 404,
                message: "Wrong username or password"
            });
        }
        // Set refresh token in a cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict"
        });
        // Login success!
        return res.status(200).json({
            errorCode: 0,
            data: { account, accessToken }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errorCode: 500,
            message: "Internal server error"
        });
    }
}
const requestAccessToken = (req, res) => {
    try {
        const newAccessToken = requestAccessTokenService(req, res);
        return newAccessToken
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const logOutCustomer = (req, res) => {
    try {
        logOutCustomerService(req, res); // Gọi hàm từ service để đăng xuất
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
module.exports = {
    registerCustomer, loginCustomer, requestAccessToken, logOutCustomer
}