const { model } = require('mongoose')
const Account = require('../models/account')
const createAccountService = async (accountData) => {
    try {
        let result = await Account.create({
            IDStaff: accountData.IDStaff,
            IDAdmin: accountData.IDAdmin,
            IDCustomer: accountData.IDCustomer,
            username: accountData.username,
            password: accountData.password,
            role: accountData.role
        })
        return result
    } catch (error) {

    }

}

const getAllAcountService = async () => {
    try {
        let result = await Account.find({})
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const putUpdateAccountService = async (id, IDStaff, IDAdmin, IDCustomer, username, password, role) => {
    try {
        let result = await Account.updateOne({ _id: id }, { IDStaff, IDAdmin, IDCustomer, username, password, role })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const deleteAccountService = async (id) => {
    try {
        let result = await Account.deleteOne({ _id: id })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    createAccountService, getAllAcountService, putUpdateAccountService, deleteAccountService
}