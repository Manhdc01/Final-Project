require('dotenv').config()
const jwt = require('jsonwebtoken')
const Account = require('../models/account')

const checkAdminPermission = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        if (!token) {
            return res.status(403).json({
                message: "You are not yet logged in"
            })
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decoded)
        const account = await Account.findById(decoded.id)
        console.log(account)

        if (!account) {
            return res.status(403).json({
                message: "Token invalid"
            })
        }

        if (account.role !== "admin") {
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
        console.log(decoded)

        const account = await Account.findById(decoded.id)
        console.log(account)

        if (!account) {
            return res.status(403).json({
                message: "Token invalid"
            })
        }

        if (account.role !== "customer") {
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
        console.log(decoded)

        const account = await Account.findById(decoded.id)
        console.log(account)

        if (!account) {
            return res.status(403).json({
                message: "Token invalid"
            })
        }

        if (account.role !== "staff") {
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
    checkAdminPermission, checkCustomerPermission, checkStaffPermission
};
