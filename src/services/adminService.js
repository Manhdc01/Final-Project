const { model } = require('mongoose')
const Admin = require('../models/admin')

const createAdminService = async (adminData) => {
    try {
        let result = await Admin.create({
            name: adminData.name,
            dateOfBirth: adminData.dateOfBirth,
            hometown: adminData.hometown,
            phone: adminData.phone,
            gender: adminData.gender,
            position: adminData.position
        })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const getAllAdminService = async () => {
    try {
        let result = await Admin.find({})
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const putUpdateAdminService = async (id, name, dateOfBirth, hometown, phone, gender, position) => {
    try {
        let result = await Admin.updateOne({ _id: id }, { name, dateOfBirth, hometown, phone, gender, position })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const deleteAdminService = async (id) => {
    try {
        let result = await Admin.deleteOne({ _id: id })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
module.exports = {
    createAdminService, getAllAdminService, putUpdateAdminService,
    deleteAdminService
}