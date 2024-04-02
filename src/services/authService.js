const { model } = require("mongoose");
const bcrypt = require('bcryptjs')
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const cookies = require('cookie-parser')

const registerUserService = async (registerData, defaultRole = 'customer') => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(registerData.password, salt);

        // Tạo mới người dùng
        let user = await User.create({
            name: registerData.name,
            phone: registerData.phone,
            email: registerData.email,
            password: hashedPassword,
            dateOfBirth: registerData.dateOfBirth,
            gender: registerData.gender,
            role: registerData.role || defaultRole
        });
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}
//Generate access token
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};
//Generate refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "365d" });
};

const loginUserService = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return null; // User not found
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return null; // Wrong password
        }
        if (user && validPassword) {
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            return { user, accessToken, refreshToken };
        }
    } catch (error) {
        console.error(error);
        return { user: null, accessToken: null, refreshToken: null };
    }
}

const requestAccessTokenService = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "You are not authenticated" });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ message: "Token invalid" });
        }
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
        });
    });
}

// logOutService.js
const logOutUserService = (req, res) => {
    try {
        res.clearCookie("refreshToken"); // Xóa cookie refreshToken khi đăng xuất
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const changePasswordService = async (userId, currentPassword, newPassword) => {
    // find user
    const user = await User.findById(userId);

    // check currrent password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
        throw new Error('Current password is incorrect');
    }

    // Encrypt the new password and update it to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

}


module.exports = {
    registerUserService, loginUserService, requestAccessTokenService, logOutUserService, changePasswordService
}

