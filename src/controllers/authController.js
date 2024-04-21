const User = require('../models/user');
const { registerUserService, requestAccessTokenService } = require('../services/authService')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password, dateOfBirth, gender, role } = req.body;

        // Gọi hàm service để đăng ký người dùng
        const registerData = {
            name,
            image: "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png",
            phone,
            email,
            password,
            dateOfBirth,
            gender,
            role: role || "customer"
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
        // Xử lý bất kỳ lỗi 
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

        // Tìm user dựa trên email
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                errorCode: 404,
                message: "User not found"
            });
        }
        // So sánh password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                errorCode: 400,
                message: "Invalid password"
            });
        }
        // Tạo token
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
        // Lưu token vào user
        user.accessToken = accessToken;
        await user.save();
        // Trả về kết quả thành công
        return res.status(200).json({
            errorCode: 0,
            data: {
                user: user,
                accessToken: accessToken
            }
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

const logOutUser = async (req, res) => {
    try {
        const user = req.user;
        user.accessToken = null;
        await user.save();
        return res.status(200).json({
            errorCode: 0,
            message: "Logout successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errorCode: 500,
            message: "Internal server error"
        });
    }
};
module.exports = {
    registerUser, loginUser, requestAccessToken, logOutUser
}