const { model } = require("mongoose");
const bcrypt = require('bcryptjs')
const Account = require('../models/account');
const jwt = require('jsonwebtoken')
const cookies = require('cookie-parser')
let refreshToken = []

const registerCustomerService = async (registerData, defaultRole = 'customer') => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(registerData.password, salt)

        //Create new user
        let account = await Account.create({
            username: registerData.username,
            password: hashed,
            role: registerData.role || defaultRole
        })
        return account
    } catch (error) {
        console.error(error);
        return null
    }
}
//Generate access token
const generateAccessToken = (accountId) => {
    return jwt.sign({ id: accountId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "45s" });
}
//generate Refresh Token
const generateRefreshToken = (accountId) => {
    return jwt.sign({ id: accountId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "365d" });
}

const loginCustomerService = async (username, password) => {
    try {
        const account = await Account.findOne({ username });
        if (!account) {
            return null; // User not found
        }
        const validPassword = await bcrypt.compare(password, account.password);
        if (!validPassword) {
            return null; // wrong pass
        }
        if (account && validPassword) {
            const accessToken = generateAccessToken(account.id);
            const refreshToken = generateRefreshToken(account.id);

            return { account, accessToken, refreshToken }
        }

    } catch (error) {
        console.error(error);
        return { account: null, accessToken: null, refreshToken: null };
    }
}

const requestAccessTokenService = (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Sử dụng req.cookies thay vì req.cookie
    if (!refreshToken) {
        return res.status(401).json({ message: "You are not authenticated" });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Token invalid" });
        }
        // Tạo mới accessToken và refreshToken
        const newAccessToken = generateAccessToken(decoded.id);
        const newRefreshToken = generateRefreshToken(decoded.id);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict"
        });
        return res.status(200).json({
            accessToken: newAccessToken
        })
    });
}

// logOutService.js
const logOutCustomerService = (req, res) => {
    try {
        res.clearCookie("refreshToken"); // Xóa cookie refreshToken khi đăng xuất
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    registerCustomerService, loginCustomerService, requestAccessTokenService, logOutCustomerService
}

