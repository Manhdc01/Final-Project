const express = require('express')
const routerAPI = express.Router()
const passport = require('passport')


const { getAllCinema, postCreateCinema, putUpdateCinema, deleteCinema } = require('../controllers/cinemaController')
const { getAllCategory, postCreateCategory, putUpdateCategory, deleteCategory } = require('../controllers/categoryController')
const { registerUser, loginUser, requestAccessToken, logOutUser } = require('../controllers/authController')
const { checkLoggedIn, checkRole } = require('../middleware/authMiddleware')
const { postCreateUser, getAllUser, putUpdateUser, deleteUser, getProfile, getSortedUsersAscending, getSortedUsersDescending
    , searchUsersByName } = require('../controllers/userController')
const { changePassword, forgotPassword, resetPassword } = require('../controllers/chagePasswordController')
const { getAllMovie, postCreateMovie, putupdateMovie, deleteMovie, getMovieNowShowing, getMovieUpcoming,
    getMovieTrailer } = require('../controllers/movieController')
const { postCreateSeatPrice, getAllSeatPrice, putUpdateSeatPrice, deleteSeatPrice } = require('../controllers/seatPriceController')
const { postCreateRoom, getAllRoom } = require('../controllers/roomController')

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

routerAPI.get('/users/search', checkRole(['admin']), searchUsersByName);
// routerAPI.get('/users', getAllUser)
// routerAPI.post('/users', postCreateUser)
// routerAPI.put('/users', putUpdateUser)
// routerAPI.delete('/users', deleteUser)
routerAPI.get('/all-users', getAllUser);
routerAPI.post('/create-users', postCreateUser);
routerAPI.put('/update-users', putUpdateUser);
routerAPI.delete('/delete-users/:id', deleteUser);

routerAPI.get('/all-cinema', checkRole(['admin']), getAllCinema)
routerAPI.post('/create-cinema', checkRole(['admin']), postCreateCinema)
routerAPI.put('/update-cinema', checkRole(['admin']), putUpdateCinema)
routerAPI.delete('/delete-cinema/:id', deleteCinema)

routerAPI.get('/all-category', checkRole(['admin']), getAllCategory)
routerAPI.post('/create-category', checkRole(['admin']), postCreateCategory)
routerAPI.put('/update-category', checkRole(['admin']), putUpdateCategory)
routerAPI.delete('/delete-category/:id', checkRole(['admin']), deleteCategory)

routerAPI.get('/all-movie', checkRole(['admin']), getAllMovie)
routerAPI.post('/create-movie', checkRole(['admin']), postCreateMovie)
routerAPI.put('/update-movie', checkRole(['admin']), putupdateMovie)
routerAPI.delete('/delete-movie/:id', checkRole(['admin']), deleteMovie)
routerAPI.get('/movie-now-showing', getMovieNowShowing)
routerAPI.get('/movie-upcoming', getMovieUpcoming)
routerAPI.get('/movies/trailer/:movieId', getMovieTrailer);


routerAPI.post('/add-seat-price', checkRole(['admin']), postCreateSeatPrice)
routerAPI.get('/all-seat-price', checkRole(['admin']), getAllSeatPrice)
routerAPI.put('/update-seat-price', checkRole(['admin']), putUpdateSeatPrice)
routerAPI.delete('/delete-seat-price/:id', checkRole(['admin']), deleteSeatPrice)

routerAPI.post('/create-room', checkRole(['admin']), postCreateRoom)
routerAPI.get('/all-room', checkRole(['admin']), getAllRoom)








module.exports = routerAPI