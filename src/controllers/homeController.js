// const connection = require('../config/database')

const getHomePage = (req, res) => {
    res.render("home.ejs")
}

module.exports = {
    getHomePage
}