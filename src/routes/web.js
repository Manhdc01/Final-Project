const express = require('express')
const routerAPI = express.Router()
const { getAllCinema, postCreateCinema, putUpdateCinema, deleteCinema } = require('../controllers/cinemaController')
const { getAllCategory, postCreateCategory, putUpdateCategory, deleteCategory } = require('../controllers/categoryController')
const { registerUser, loginUser, requestAccessToken, logOutUser } = require('../controllers/authController')
const { checkAdminPermission, checkCustomerPermission, checkStaffPermission, checkLoggedIn } = require('../middleware/authMiddleware')
const { postCreateUser, getAllUser, putUpdateUser, deleteUser } = require('../controllers/userController')
const { changePassword } = require('../controllers/chagePasswordController')
routerAPI.get('/login', (req, res) => {
    res.render('login.ejs')
})

routerAPI.post('/login', loginUser)//loginUser

routerAPI.post('/register', registerUser)
routerAPI.post('/refresh', requestAccessToken)
routerAPI.post('/logout', checkLoggedIn, logOutUser)

routerAPI.post('/change-password', checkLoggedIn, changePassword)


routerAPI.get('/users', checkLoggedIn, getAllUser)
routerAPI.post('/users', postCreateUser)
routerAPI.put('/users', putUpdateUser)
routerAPI.delete('/users', deleteUser)

routerAPI.get('/cinema', getAllCinema)
routerAPI.post('/cinema', postCreateCinema)
routerAPI.put('/cinema', putUpdateCinema)
routerAPI.delete('/cinema', deleteCinema)

routerAPI.get('/category', getAllCategory)
routerAPI.post('/category', postCreateCategory)
routerAPI.put('/category', putUpdateCategory)
routerAPI.delete('/category', deleteCategory)





module.exports = routerAPI