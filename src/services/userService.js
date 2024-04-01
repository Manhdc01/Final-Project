const { model } = require("mongoose")
const User = require('../models/user')

const createUserService = async (userData) => {
    try {
        let result = await User.create({
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
            password: userData.password,
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
        let result = await User.findByIdAndUpdate(id, { name, phone, email, password, dateOfBirth, gender, role });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const deleteUserService = async (id) => {
    try {
        let result = await User.findByIdAndDelete(id)
        return result
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    createUserService, getAllUserService, putUpdateUserService, deleteUserService
}