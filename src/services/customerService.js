const { model } = require('mongoose')
const Customer = require('../models/customer')
const createACustomerService = async (customerData) => {
    try {
        let result = await Customer.create({
            email: customerData.email,
            name: customerData.name,
            dateOfBirth: customerData.dateOfBirth,
            hometown: customerData.hometown,
            phone: customerData.phone,
            gender: customerData.gender
        })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const getAllCustomerService = async () => {
    try {
        let result = await Customer.find({})
        return result
    } catch (error) {
        console.log(error)
        return null
    }

}

const putUpdateCustomerService = async (id, email, name, dateOfBirth, hometown, phone, gender) => {
    try {
        let result = await Customer.updateOne({ _id: id }, { email, name, dateOfBirth, hometown, phone, gender })
        return result
    } catch (error) {
        console.log(error)
        return null
    }

}
const deleteCustomerService = async (id) => {
    try {
        let result = await Customer.deleteOne({ _id: id })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}


module.exports = {
    createACustomerService, getAllCustomerService, putUpdateCustomerService, deleteCustomerService
}