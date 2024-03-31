const { createAccountService, getAllAcountService, putUpdateAccountService, deleteAccountService } = require('../services/accountService')

const postCreateAccount = async (req, res) => {
    let { IDStaff, IDAdmin, IDCustomer, username, password, role } = req.body
    let accountData = {
        IDStaff,
        IDAdmin,
        IDCustomer,
        username,
        password,
        role
    }

    let account = await createAccountService(accountData)
    return res.status(200).json({
        errorCode: 0,
        data: account
    })
}

const getAllAccount = async (req, res) => {
    let account = await getAllAcountService()
    return res.status(200).json({
        errorCode: 0,
        data: account
    })
}

const putUpdateAccount = async (req, res) => {
    let { id, IDStaff, IDAdmin, IDCustomer, username, password, role } = req.body
    let account = await putUpdateAccountService(id, IDStaff, IDAdmin, IDCustomer, username, password, role)
    return res.status(200).json({
        errorCode: 0,
        data: account
    })
}

const deleteAccount = async (req, res) => {
    let id = req.body.id
    let result = await deleteAccountService(id)
    return res.status(200).json({
        errorCode: 0,
        data: result
    })
}



module.exports = {
    postCreateAccount, getAllAccount, putUpdateAccount, deleteAccount
}