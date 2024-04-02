

const { registerUserService, loginUserService, requestAccessTokenService, logOutUserService } = require('../services/authService')

const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password, dateOfBirth, gender, role } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!email || !password || !role || !name || !phone || !dateOfBirth || !gender) {
            return res.status(400).json({ errorCode: 400, message: "Missing required fields" });
        }

        // Gọi hàm service để đăng ký người dùng
        const registerData = {
            name,
            phone,
            email,
            password,
            dateOfBirth,
            gender,
            role
        };

        const register = await registerUserService(registerData);

        // Kiểm tra kết quả đăng ký từ service
        if (!register) {
            return res.status(500).json({
                errorCode: 500,
                message: "Failed to register user"
            });
        }

        // Trả về kết quả thành công
        return res.status(200).json({
            errorCode: 0,
            data: register
        });
    } catch (error) {
        // Xử lý bất kỳ lỗi nào xảy ra trong quá trình xử lý request
        console.error(error);
        return res.status(500).json({
            errorCode: 500,
            message: "Internal server error"
        });
    }

}

const loginUser = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const loginResult = await loginUserService(email, password);

        if (!loginResult || !loginResult.accessToken) {
            // Không có kết quả hoặc accessToken không tồn tại
            return res.status(300).json({
                errorCode: 300,
                message: "Wrong email or password"
            });
        }

        const { accessToken, refreshToken, user } = loginResult;

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
            data: { user, accessToken }
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

const logOutUser = (req, res) => {
    try {
        logOutUserService(req, res); // Gọi hàm từ service để đăng xuất
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
module.exports = {
    registerUser, loginUser, requestAccessToken, logOutUser
}