const express = require('express')
const routerAPI = express.Router()
const passport = require('passport')


const { getAllCinema, postCreateCinema, putUpdateCinema, deleteCinema } = require('../controllers/cinemaController')
const { getAllCategory, postCreateCategory, putUpdateCategory, deleteCategory } = require('../controllers/categoryController')
const { registerUser, loginUser, requestAccessToken, logOutUser } = require('../controllers/authController')
const { checkAdminPermission, checkCustomerPermission, checkStaffPermission, checkLoggedIn } = require('../middleware/authMiddleware')
const { postCreateUser, getAllUser, putUpdateUser, deleteUser, getProfile, getSortedUsersAscending, getSortedUsersDescending
    , searchUsersByName } = require('../controllers/userController')
const { changePassword, forgotPassword, resetPassword } = require('../controllers/chagePasswordController')
const { getAllMovie, postCreateMovie, } = require('../controllers/movieController')


routerAPI.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

routerAPI.get('/google/redirect',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        const { user, accessToken } = req.user;
        res.status(200).json({
            user: user,
            accessToken: accessToken
        });
    });

routerAPI.get('/login', (req, res) => {
    res.render('login.ejs')
})


routerAPI.post('/login', loginUser)//loginUser

routerAPI.post('/register', registerUser)
routerAPI.post('/refresh', requestAccessToken)
routerAPI.post('/logout', checkLoggedIn, logOutUser)

routerAPI.post('/change-password', checkLoggedIn, changePassword)
routerAPI.post('/forgot-password', forgotPassword)
routerAPI.post('/reset-password', resetPassword)

routerAPI.get('/profile', getProfile)
routerAPI.get('/users/sorted-ascending', getSortedUsersAscending);
routerAPI.get('/users/sorted-descending', getSortedUsersDescending);

routerAPI.get('/users/search', checkAdminPermission, searchUsersByName);
routerAPI.get('/users', checkAdminPermission, getAllUser)
routerAPI.post('/users', checkAdminPermission, postCreateUser)
routerAPI.put('/users', checkAdminPermission, putUpdateUser)
routerAPI.delete('/users', checkAdminPermission, deleteUser)

routerAPI.get('/cinema', checkAdminPermission, getAllCinema)
routerAPI.post('/cinema', checkAdminPermission, postCreateCinema)
routerAPI.put('/cinema', checkAdminPermission, putUpdateCinema)
routerAPI.delete('/cinema', deleteCinema)

routerAPI.get('/category', checkAdminPermission, getAllCategory)
routerAPI.post('/category', checkAdminPermission, postCreateCategory)
routerAPI.put('/category', checkAdminPermission, putUpdateCategory)
routerAPI.delete('/category', checkAdminPermission, deleteCategory)

routerAPI.get('/movie', checkAdminPermission, getAllMovie)
routerAPI.post('/category', checkAdminPermission, postCreateMovie)




module.exports = routerAPI