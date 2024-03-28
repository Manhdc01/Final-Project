const { createACustomerService, getAllCustomerService, putUpdateCustomerService, deleteCustomerService } = require('../services/customerService')
const postCreateCustomer = async (req, res) => {
    let { email, name, dateOfBirth, hometown, phone, gender } = req.body
    let customerData = {
        email,
        name,
        dateOfBirth,
        hometown,
        phone,
        gender
    }

    let customer = await createACustomerService(customerData)

    return res.status(200).json({
        errorCode: 0,
        data: customer
    })
}
const getAllCustomer = async (req, res) => {
    let customer = await getAllCustomerService()
    return res.status(200).json({
        errorCode: 0,
        data: customer
    })

}

const putUpdateCustomer = async (req, res) => {
    let { id, email, name, dateOfBirth, hometown, phone, gender } = req.body
    let customer = await putUpdateCustomerService(id, email, name, dateOfBirth, hometown, phone, gender)
    return res.status(200).json({
        errorCode: 0,
        data: customer
    })

}

const deleteCustomer = async (req, res) => {
    let id = req.body.id
    let result = await deleteCustomerService(id)
    return res.status(200).json({
        errorCode: 0,
        data: result
    })
}

module.exports = {
    postCreateCustomer, getAllCustomer, putUpdateCustomer, deleteCustomer
}