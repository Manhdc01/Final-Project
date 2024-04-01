const express = require('express')
const routerAPI = express.Router()
const { getAllCinema, postCreateCinema, putUpdateCinema, deleteCinema } = require('../controllers/cinemaController')
const { getAllCategory, postCreateCategory, putUpdateCategory, deleteCategory } = require('../controllers/categoryController')
const { registerUser, loginUser, requestAccessToken, logOutUser } = require('../controllers/authController')
const { checkAdminPermission, checkCustomerPermission, checkStaffPermission, checkLoggedIn } = require('../middleware/authMiddleware')
const { postCreateUser, getAllUser, putUpdateUser, deleteUser } = require('../controllers/userController')
// Route cho trang chủ, mọi người đều có thể truy cập
routerAPI.get('/homePage', (req, res) => {
    res.send('Welcome to the home page!');
});

// Route '/adminPage' chỉ có thể truy cập bởi người dùng có vai trò là 'admin'
routerAPI.get('/adminPage', checkLoggedIn, checkAdminPermission, (req, res) => {
    res.send('Welcome to the admin page!');
});

// Route '/staffPage' chỉ có thể truy cập bởi người dùng có vai trò là 'staff' hoặc 'admin'
routerAPI.get('/staffPage', checkLoggedIn, checkStaffPermission, (req, res) => {
    res.send('Welcome to the staff page!');
});

routerAPI.get('/login', (req, res) => {
    res.render('login.ejs')
})
routerAPI.post('/register', registerUser)
routerAPI.post('/login', loginUser)
routerAPI.post('/refresh', requestAccessToken)
routerAPI.post('/logout', checkLoggedIn, logOutUser)

routerAPI.get('/users', getAllUser)
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