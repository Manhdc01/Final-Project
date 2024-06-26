const User = require('../models/user');
const fs = require('fs')
const jwt = require('jsonwebtoken');
const { createUserService, getAllUserService, putUpdateUserService, deleteUserService, getProfileByTokenService,
    updateUserProfile } = require('../services/userService')
const { uploadSingleFile } = require('../services/fileService')
const { uploadImage } = require('../services/movieService')

const postCreateUser = async (req, res) => {
    let { name, phone, email, password, dateOfBirth, gender, role, cinema } = req.body
    // check email exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({
            errorCode: 1,
            message: "Email already exists"
        });
    }
    let userData = { name, phone, email, password, dateOfBirth, gender, role, cinema }
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
        const page = req.query.page || 1; // Trang mặc định là 1 nếu không có trang được chỉ định
        const limit = 5; // Số lượng người dùng trên mỗi trang

        const skip = (page - 1) * limit; // Số lượng bản ghi cần bỏ qua

        // Lấy tổng số người dùng
        const totalUsers = await User.countDocuments();

        // Lấy danh sách người dùng theo trang và giới hạn
        const userList = await User.find().skip(skip).limit(limit);

        // Tính tổng số trang
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({ errorCode: 0, data: userList, totalPages, currentPage: page });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorCode: 1, message: "Internal server error" });
    }
}

const getAllAdminCinema = async (req, res) => {
    try {
        const adminCinema = await User.find({ role: 'admin cinema' }).populate('cinema');
        return res.status(200).json({
            errorCode: 0,
            data: adminCinema
        });
    } catch (error) {
        console.error(error);
    }
}


const putUpdateUser = async (req, res) => {
    let { id, name, phone, email, password, dateOfBirth, gender, role, cinema } = req.body
    let userData = { name, phone, email, password, dateOfBirth, gender, role, cinema }

    const existingUser = await User.findById(id);
    // Initialize userData.image with existing image to retain it if no new image is uploaded.
    userData.image = existingUser.image;
    // console.log("check", userData.image)
    let imageUploadResult = {}
    if (req.files && req.files.image) {
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
    }
    let userUpdate = await putUpdateUserService(id, userData);
    return res.status(200).json({
        errorCode: 0,
        data: userUpdate
    });
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

// getProfile by token
const getProfileByToken = async (req, res) => {
    try {
        // Lấy token từ header của yêu cầu
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token)
        // Giải mã token để lấy thông tin người dùng
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded)
        // Lấy id của người dùng từ decoded token
        const id = decoded.userId; // Thay đổi từ 'id' sang 'userId'
        // Gọi service để lấy thông tin profile dựa trên userId
        const userProfile = await getProfileByTokenService(id);
        console.log(userProfile)
        // Trả về kết quả thành công
        return res.status(200).json({
            errorCode: 0,
            data: userProfile
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error);
        return res.status(500).json({
            errorCode: 500,
            message: "Internal server error"
        });
    }
}

const updateUserProfileByToken = async (req, res) => {
    try {
        let { id, name, email, phone, dateOfBirth, gender } = req.body;
        let dataUser = {
            name, email, phone, dateOfBirth, gender
        }
        const existingUser = await User.findById(id);
        // Initialize userData.image with existing image to retain it if no new image is uploaded.
        dataUser.image = existingUser.image;
        // console.log("check", userData.image)
        let imageUploadResult = {}
        if (req.files && req.files.image) {
            let image = req.files.image;
            let fileUploadResult = await uploadSingleFile(image);
            let file_addr = fileUploadResult.path;
            // console.log("Url image:", file_addr);
            // upload to imgur
            imageUploadResult = await uploadImage(file_addr);
            // console.log(">>>>check", imageUploadResult)
            dataUser.image = imageUploadResult.imageUrl
            // remove file from local
            try {
                fs.unlinkSync(file_addr);
            }
            catch (err) {
                console.log(err)
            }
        }
        let userUpdate = await putUpdateUserService(id, dataUser);
        return res.status(200).json({
            errorCode: 0,
            data: userUpdate
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const totalAccountCustomer = async (req, res) => {
        const totalAccount = await User.countDocuments({ role: 'customer' });
        return res.status(200).json({
            errorCode: 0,
            data: totalAccount
        });

}
const totalAccountStaff = async (req, res) => {
    const totalAccount = await User.countDocuments({ role: 'staff' });
    return res.status(200).json({
        errorCode: 0,
        data: totalAccount
    });
}
const totalAccountStaffInCinema = async (req, res) => {
    const totalAccount = await User.countDocuments({ role: 'staff', cinema: req.params.cinemaId });
    return res.status(200).json({
        errorCode: 0,
        data: totalAccount
    });
}


module.exports = {
    postCreateUser, getAllUser, putUpdateUser, deleteUser, getSortedUsersAscending, getSortedUsersDescending, searchUsersByName,
    getProfileByToken, updateUserProfileByToken, getAllAdminCinema, totalAccountCustomer, totalAccountStaff,totalAccountStaffInCinema
}