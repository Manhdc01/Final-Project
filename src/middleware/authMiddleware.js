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

const checkAdminPermission = async (req, res, next) => {
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

        if (user.role !== "admin") {
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

const checkCustomerPermission = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

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

        if (user.role !== "customer") {
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

const checkStaffPermission = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

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

        if (user.role !== "staff") {
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
module.exports = {
    checkLoggedIn, checkAdminPermission, checkCustomerPermission, checkStaffPermission
};
