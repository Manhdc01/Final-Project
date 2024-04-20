const { model } = require("mongoose");
const bcrypt = require('bcryptjs')
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const cookies = require('cookie-parser')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

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
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
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
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        return { user, accessToken, refreshToken };
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
        localStorage.removeItem('accessToken');
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

const sendResetEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return;
        }
        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiresAt = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        console.log(">>>Token:::", resetToken)
        // Construct reset link
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

        // Send reset email
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `<p>You are receiving this email because a password reset request was received for your account.</p>
                   <p>Please click <a href="${resetLink}">here</a> to reset your password.</p>
                   <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
        };
        await transporter.sendMail(mailOptions);

        return resetToken;
    } catch (error) {
        console.log('Failed to send reset email');
        return
    }
};

const resetPasswordService = async (token, newPassword) => {
    try {
        // Find user by reset token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiresAt: { $gt: Date.now() }
        });

        // If user not found or token expired
        if (!user) {
            return { status: 400, message: 'Invalid or expired reset token' };
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Set new password
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiresAt = undefined;
        await user.save();

        // Return success response
        return { status: 200, message: 'Password reset successfully' };
    } catch (error) {
        throw new Error('Failed to reset password');
    }
}



module.exports = {
    registerUserService, loginUserService, requestAccessTokenService, logOutUserService, changePasswordService,
    sendResetEmail, resetPasswordService,
    generateAccessToken, generateRefreshToken//upsert is update and insert
}

