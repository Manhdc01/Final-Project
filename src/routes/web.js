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
const { getAllMovie, postCreateMovie, putupdateMovie, deleteMovie, getMovieNowShowing, getMovieUpcoming } = require('../controllers/movieController')


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
// routerAPI.get('/users', getAllUser)
// routerAPI.post('/users', postCreateUser)
// routerAPI.put('/users', putUpdateUser)
// routerAPI.delete('/users', deleteUser)
routerAPI.get('/all-users', getAllUser);
routerAPI.post('/create-users', postCreateUser);
routerAPI.put('/update-users', putUpdateUser);
routerAPI.delete('/delete-users/:id', deleteUser);

routerAPI.get('/all-cinema', checkAdminPermission, getAllCinema)
routerAPI.post('/create-cinema', checkAdminPermission, postCreateCinema)
routerAPI.put('/update-cinema', checkAdminPermission, putUpdateCinema)
routerAPI.delete('/delete-cinema/:id', deleteCinema)

routerAPI.get('/all-category', checkAdminPermission, getAllCategory)
routerAPI.post('/create-category', checkAdminPermission, postCreateCategory)
routerAPI.put('/update-category', checkAdminPermission, putUpdateCategory)
routerAPI.delete('/delete-category/:id', checkAdminPermission, deleteCategory)

routerAPI.get('/all-movie', checkAdminPermission, getAllMovie)
routerAPI.post('/create-movie', checkAdminPermission, postCreateMovie)
routerAPI.put('/update-movie', checkAdminPermission, putupdateMovie)
routerAPI.delete('/delete-movie/:id', checkAdminPermission, deleteMovie)
routerAPI.get('/movie-now-showing', getMovieNowShowing)
routerAPI.get('/movie-upcoming', getMovieUpcoming)







module.exports = routerAPI