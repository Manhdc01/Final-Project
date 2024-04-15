const { model } = require("mongoose")
const User = require('../models/user')
const bcrypt = require('bcryptjs');


const createUserService = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    try {
        let result = await User.create({
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
            password: hashedPassword,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            role: userData.role
        });
        console.log(result);
        if (!result) {
            console.error('Failed to create user')
            return null
        } else {
            return result
        }
    } catch (error) {
        console.log(error)
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
const putUpdateUserService = async (id, name, phone, email, password, dateOfBirth, gender, role) => {
    try {
        let result = await User.updateOne({ _id: id }, { name, phone, email, password, dateOfBirth, gender, role });
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
const getProfileService = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return null;
        }

        return {
            name: user.name,
            email: user.email,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
        };
    } catch (error) {
        console.error("Error when getting profile:", error);
        return null;
    }
}



module.exports = {
    createUserService, getAllUserService, putUpdateUserService, deleteUserService, getProfileService
}