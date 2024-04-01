require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const checkLoggedIn = async (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(403).json({
                message: "You are not logged in"
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(403).json({
                message: "Token invalid"
            });
        }

        req.user = user; // Lưu thông tin tài khoản vào request để sử dụng sau này
        next();
    } catch (error) {
        return res.status(500).json({
            name: error.name,
            message: error.message
        });
    }
};

const checkAdminPermission = async (req, res, next) => {
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
