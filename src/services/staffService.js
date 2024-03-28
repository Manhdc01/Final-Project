const { model } = require('mongoose')
const Staff = require('../models/staff')

const createStaffService = async (staffData) => {
    try {
        let result = await Staff.create({
            name: staffData.name,
            dateOfBirth: staffData.dateOfBirth,
            hometown: staffData.hometown,
            phone: staffData.phone,
            gender: staffData.gender,
            position: staffData.position
        })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const getAllStaffService = async () => {
    try {
        let result = await Staff.find({})
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const putUpdateStaffService = async (id, name, dateOfBirth, hometown, phone, gender, position) => {
    try {
        let result = await Staff.updateOne({ _id: id }, { name, dateOfBirth, hometown, phone, gender, position })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const deleteAStaffService = async (id) => {
    try {
        let result = await Staff.deleteOne({ _id: id })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
module.exports = {
    createStaffService, getAllStaffService, putUpdateStaffService,
    deleteAStaffService
}