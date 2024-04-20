const { model } = require("mongoose")
const User = require('../models/user')
const bcrypt = require('bcryptjs');


const createUserService = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    try {
        let result = await User.create({
            name: userData.name,
            image: userData.image,
            phone: userData.phone,
            email: userData.email,
            password: hashedPassword,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            role: userData.role
        });
        console.log(result);
        if (!result) {
            console.error('Failed to create user');
            return null;
        } else {
            return result;
        }
    } catch (error) {
        console.log(error);
        return null;
    }

}
const getAllUserService = async (req, res) => {
    try {
        let result = await User.find()

        if (!result || result.length === 0) {
            console.error('No users found')
            return null;
        }

        return result
    } catch (error) {
        console.log(error)
        return null
    }

}
const putUpdateUserService = async (id, userData) => {
    try {
        let result = await User.updateOne({ _id: id }, { $set: userData });
        console.log(">>>>>", result)
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const deleteUserService = async (userId) => {
    try {
        let result = await User.deleteOne({ _id: userId })
        return result
    } catch (error) {
        console.log(error);
        return null;
    }
}
const getProfileByTokenService = async (id) => {
    try {
        // Tìm thông tin profile dựa trên userId
        const userProfile = await User.findOne({ _id: id }).select('image name email dateOfBirth gender');

        // Kiểm tra xem profile có tồn tại không
        if (!userProfile) {
            console.log(`User profile not found for user with ID ${id}`);
        }

        // Trả về thông tin profile nếu tồn tại
        return userProfile;
    } catch (error) {
        // Ném lỗi nếu có lỗi xảy ra
        console.error(error);
        throw error;
    }

}

module.exports = {
    createUserService, getAllUserService, putUpdateUserService, deleteUserService, getProfileByTokenService
}