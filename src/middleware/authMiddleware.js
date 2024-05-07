require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const checkLoggedIn = async (req, res, next) => {
    try {
        // First, try to get the token from the Authorization header
        let token = req.headers.authorization?.split(" ")[1];
        // If no token in Authorization header, check the cookies
        if (!token) {
            token = req.cookies['jwt']; // Assuming your token stored in cookies is named 'jwt'
        }
        // If still no token, return an error
        if (!token) {
            return res.status(401).json({ message: "JWT must be provided" });
        }
        // Verify the token
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        if (!user) {
            return res.status(404).json({
                errorCode: 404,
                message: "User not found"
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        // Determine if it's an invalid token or other errors
        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({
                errorCode: 403,
                message: "Invalid token"
            });
        }
        return res.status(500).json({
            errorCode: 500,
            message: "Internal server error"
        });
    }
};

const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(payload.userId);
            if (!user) {
                return res.status(404).json({
                    errorCode: 404,
                    message: "User not found"
                });
            }
            if (roles.includes(user.role)) {
                req.user = user
                next()
            }
            else {
                return res.status(403).json({
                    errorCode: 403,
                    message: "Forbidden"
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                errorCode: 500,
                message: "Internal server error"
            });
        }
    };
};
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
// Middleware để thiết lập tham số 'all' trước khi gọi getAllMovie
const setAllParam = (req, res, next) => {
    req.query.all = 'true';
    next();
};
module.exports = {
    checkLoggedIn, checkRole, validateUserData, setAllParam
};
