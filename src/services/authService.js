const { model } = require("mongoose");
const bcrypt = require('bcryptjs')
const Account = require('../models/account');
const registerCustomerService = async (registerData) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(registerData.password, salt)

        //Create new user
        let account = await Account.create({
            username: registerData.username,
            password: hashed,
            role: 'customer'
        })
        return account
    } catch (error) {
        console.error(error);
        return null
    }
}

const loginCustomerService = async (username, password) => {
    try {
        const account = await Account.findOne({ username });
        if (!account) {
            return null; // User not found
        }
        const validPassword = await bcrypt.compare(password, account.password);
        if (!validPassword) {
            return null; // wrong pass
        }
        return account;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    registerCustomerService, loginCustomerService
}

