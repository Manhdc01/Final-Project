const { model } = require("mongoose");
const bcrypt = require('bcryptjs')
const Account = require('../models/account');
const jwt = require('jsonwebtoken')

const registerCustomerService = async (registerData, defaultRole = 'customer') => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(registerData.password, salt)

        //Create new user
        let account = await Account.create({
            username: registerData.username,
            password: hashed,
            role: registerData.role || defaultRole
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
        if (account && validPassword) {
            const token = jwt.sign({
                id: account.id,
            },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            )
            return { account, token }
        }

    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    registerCustomerService, loginCustomerService
}

