const User = require('../models/user');
const fs = require('fs')
const { createUserService, getAllUserService, putUpdateUserService, deleteUserService, getProfileService } = require('../services/userService')
const { uploadSingleFile } = require('../services/fileService')
const { uploadImage } = require('../services/movieService')

const postCreateUser = async (req, res) => {
    let { name, phone, email, password, dateOfBirth, gender, role } = req.body
    let userData = { name, phone, email, password, dateOfBirth, gender, role }
    let imageUploadResult = {}
    if (!req.files || !req.files.image) {
        console.log("No file uploaded");
    } else {
        let file_dir = req.files.image;
        let fileUploadResult = await uploadSingleFile(file_dir);
        let file_addr = fileUploadResult.path;
        // console.log("Url image:", file_addr);
        // upload to imgur
        imageUploadResult = await uploadImage(file_addr);
        // console.log(">>>>check", imageUploadResult)
        userData.image = imageUploadResult.imageUrl
        // remove file from local
        try {
            fs.unlinkSync(file_addr);
        }
        catch (err) {
            console.log(err)
        }

        let user = await createUserService(userData);
        return res.status(200).json({
            errorCode: 0,
            data: user
        });
    }
}

const getAllUser = async (req, res) => {
    try {
        let userList = await getAllUserService();
        if (!userList) {
            return res.status(500).json({ errorCode: 1, message: "Failed to retrieve user data" });
        }
        return res.status(200).json({ errorCode: 0, data: userList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorCode: 1, message: "Internal server error" });
    }
}

const putUpdateUser = async (req, res) => {
    let { id, name, phone, email, password, dateOfBirth, gender, role } = req.body
    let userData = { name, phone, email, password, dateOfBirth, gender, role }

    let imageUploadResult = {}
    if (!req.files || !req.files.image) {
        console.log("No file uploaded");
    } else {
        let image = req.files.image;
        let fileUploadResult = await uploadSingleFile(image);
        let file_addr = fileUploadResult.path;
        // console.log("Url image:", file_addr);
        // upload to imgur
        imageUploadResult = await uploadImage(file_addr);
        // console.log(">>>>check", imageUploadResult)
        userData.image = imageUploadResult.imageUrl
        // remove file from local
        try {
            fs.unlinkSync(file_addr);
        }
        catch (err) {
            console.log(err)
        }
        let userUpdate = await putUpdateUserService(id, userData);
        return res.status(200).json({
            errorCode: 0,
            data: userUpdate
        });
    }
}

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const userDelete = await deleteUserService(userId);
        if (userDelete) {
            return res.status(200).json({
                errorCode: 0,
                data: userDelete
            });
        } else {
            // Nếu không tìm thấy người dùng để xóa, trả về phản hồi 404
            return res.status(404).json({
                errorCode: 404,
                message: "User not found"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: 500,
            message: "Internal server error"
        });
    }
}

const getProfile = async (req, res) => {
    console.log(userId)
    let id = req.body.id
    let userProfile = await getProfileService(id)
    return res.status(200).json({
        errorCode: 0,
        data: userProfile
    })
}

const getSortedUsersAscending = async (req, res) => {
    const usersSorted = await User.find().sort({ name: 1 });
    res.status(200).json(usersSorted);
};

const getSortedUsersDescending = async (req, res) => {
    const usersSorted = await User.find().sort({ name: -1 });
    res.status(200).json(usersSorted);
};

const searchUsersByName = async (req, res) => {
    try {
        const { name } = req.query;
        const regex = new RegExp(name, 'i'); // 'i' to search case-insensitively
        const users = await User.find({ name: { $regex: regex } });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error while searching users by name:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = {
    postCreateUser, getAllUser, putUpdateUser, deleteUser, getProfile, getSortedUsersAscending, getSortedUsersDescending, searchUsersByName
}