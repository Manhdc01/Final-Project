require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const checkLoggedIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        // Kiểm tra xem token có tồn tại không
        if (!token) {
            return res.status(403).json({
                message: "You are not logged in"
            });
        }

        // Xác thực token và lấy thông tin người dùng
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(403).json({
                message: "Token invalid"
            });
        }

        // Lưu thông tin người dùng vào req.user
        req.user = user;

        // Nếu người dùng hợp lệ, cho phép tiếp tục xử lý yêu cầu
        next();
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error);
        return res.status(500).json({
            name: error.name,
            message: error.message
        });
    }
};

const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1]

            if (!token) {
                return res.status(403).json({
                    message: "You are not yet logged in"
                })
            }
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findById(decoded.id)

            if (!user) {
                return res.status(403).json({
                    message: "Token invalid"
                })
            }

            if (!roles.includes(user.role)) {
                return res.status(400).json({
                    message: "You have no rights"
                })
            }

            next()
        } catch (error) {
            return res.json({
                name: error.name,
                message: error.message
            })
        }
    }
}
const validateUserData = async (req, res, next) => {
    const { email, password } = req.body;

    // Kiểm tra độ dài của mật khẩu
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    // Kiểm tra xem email có đuôi @gmail.com hay không
    if (!email.endsWith('@gmail.com')) {
        return res.status(400).json({ error: 'Email must end with @gmail.com.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered.' });
    }
    // Nếu mọi thứ đều hợp lệ, tiếp tục xử lý yêu cầu
    next();
};
module.exports = {
    checkLoggedIn, checkRole, validateUserData
};
