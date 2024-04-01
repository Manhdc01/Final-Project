const { createUserService, getAllUserService, putUpdateUserService, deleteUserService } = require('../services/userService')

const postCreateUser = async (req, res) => {
    try {
        const { name, phone, email, password, dateOfBirth, gender, role } = req.body
        if (!name || !phone || !email || !password || !dateOfBirth || !gender || !role) {
            return res.status(400).json({
                errorCode: 1,
                message: "Missing required fields"
            });
        }
        const userData = { name, phone, email, password, dateOfBirth, gender, role }

        const user = await createUserService(userData)

        if (!user) {
            return res.status(500).json({
                errorCode: 2,
                message: "Failed to create user"
            });
        }

        return res.status(200).json({
            errorCode: 0,
            data: user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errorCode: 3,
            message: "Internal server error"
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
    const { id, name, phone, email, password, dateOfBirth, gender, role } = req.body;
    let userUpdate = await putUpdateUserService(id, name, phone, email, password, dateOfBirth, gender, role);
    return res.status(200).json({
        errorCode: 0,
        data: userUpdate
    });
}

const deleteUser = async (req, res) => {
    let id = req.body.id
    let userDelete = await deleteUserService(id)
    return res.status(200).json({
        errorCode: 0,
        data: userDelete
    })
}



module.exports = {
    postCreateUser, getAllUser, putUpdateUser, deleteUser
}