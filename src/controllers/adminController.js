const { createAdminService, getAllAdminService, putUpdateAdminService, deleteAdminService } = require('../services/adminService')

const postCreateAdmin = async (req, res) => {
    let { name, dateOfBirth, hometown, phone, gender, position } = req.body
    let adminData = {
        name,
        dateOfBirth,
        hometown,
        phone,
        gender,
        position
    }

    let admin = await createAdminService(adminData)

    return res.status(200).json({
        errorCode: 0,
        data: admin
    })
}

const getAllAdmin = async (req, res) => {
    let result = await getAllAdminService()
    return res.status(200).json({
        errorCode: 0,
        data: result
    })
}

const putUpdateAdmin = async (req, res) => {
    let { id, name, dateOfBirth, hometown, phone, gender, position } = req.body
    let result = await putUpdateAdminService(id, name, dateOfBirth, hometown, phone, gender, position)
    return res.status(200).json({
        errorCode: 0,
        data: result
    })
}

const deleteAdmin = async (req, res) => {
    let id = req.body.id
    let result = await deleteAdminService(id)
    return res.status(200).json({
        errorCode: 0,
        data: result
    })
}

module.exports = {
    postCreateAdmin, getAllAdmin, putUpdateAdmin, deleteAdmin
}