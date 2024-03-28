const { createStaffService, getAllStaffService, putUpdateStaffService, deleteAStaffService } = require('../services/staffService')

const postCreateStaff = async (req, res) => {
    let { name, dateOfBirth, hometown, phone, gender, position } = req.body
    let staffData = {
        name,
        dateOfBirth,
        hometown,
        phone,
        gender,
        position
    }

    let staff = await createStaffService(staffData)

    return res.status(200).json({
        errorCode: 0,
        data: staff
    })
}

const getAllStaff = async (req, res) => {
    let result = await getAllStaffService()
    return res.status(200).json({
        errorCode: 0,
        data: result
    })
}

const putUpdateStaff = async (req, res) => {
    let { id, name, dateOfBirth, hometown, phone, gender, position } = req.body
    let result = await putUpdateStaffService(id, name, dateOfBirth, hometown, phone, gender, position)
    return res.status(200).json({
        errorCode: 0,
        data: result
    })
}

const deleteAStaff = async (req, res) => {
    let id = req.body.id
    let result = await deleteAStaffService(id)
    return res.status(200).json({
        errorCode: 0,
        data: result
    })
}

module.exports = {
    postCreateStaff, getAllStaff, putUpdateStaff, deleteAStaff
}