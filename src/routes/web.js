const express = require('express')
const routerAPI = express.Router()
const passport = require('passport')


const { getAllCinema, postCreateCinema, putUpdateCinema, deleteCinema, getProvincesCinema,
    getCinemaByProvince } = require('../controllers/cinemaController')
const { getAllCategory, postCreateCategory, putUpdateCategory, deleteCategory } = require('../controllers/categoryController')
const { registerUser, loginUser, requestAccessToken, logOutUser } = require('../controllers/authController')
const { checkLoggedIn, checkRole, validateUserData } = require('../middleware/authMiddleware')
const { postCreateUser, getAllUser, putUpdateUser, deleteUser, getSortedUsersAscending, getSortedUsersDescending
    , searchUsersByName, getProfileByToken, updateUserProfileByToken } = require('../controllers/userController')
const { changePassword, forgotPassword, resetPassword } = require('../controllers/chagePasswordController')
const { getAllMovie, postCreateMovie, putupdateMovie, deleteMovie, getMovieNowShowing, getMovieUpcoming,
    getMovieTrailer, searchMovieByName, getMovieById } = require('../controllers/movieController')
const { postCreateSeatPrice, getAllSeatPrice, putUpdateSeatPrice, deleteSeatPrice } = require('../controllers/seatPriceController')
const { postCreateRoom, getAllRoom } = require('../controllers/roomController')
const { postCreateShowTime, getAllShowTime, updateShowTime, deleteShowTime,
    showTimeByDate } = require('../controllers/showTimeController')
const { addFood, getAllFood, putUpdateFood, deleteFood } = require('../controllers/foodController')

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

routerAPI.post('/register', validateUserData, registerUser)
// routerAPI.post('/refresh', requestAccessToken)
routerAPI.post('/logout', checkLoggedIn, logOutUser)

routerAPI.post('/change-password', checkLoggedIn, changePassword)
routerAPI.post('/forgot-password', forgotPassword)
routerAPI.post('/reset-password', resetPassword)

routerAPI.get('/users/sorted-ascending', getSortedUsersAscending);
routerAPI.get('/users/sorted-descending', getSortedUsersDescending);

routerAPI.get('/users/search', checkRole(['admin']), searchUsersByName);
// routerAPI.get('/users', getAllUser)
// routerAPI.post('/users', postCreateUser)
// routerAPI.put('/users', putUpdateUser)
// routerAPI.delete('/users', deleteUser)
routerAPI.get('/all-users', checkRole(['admin']), getAllUser);
routerAPI.post('/create-users', checkRole(['admin']), postCreateUser);
routerAPI.put('/update-users', checkRole(['admin']), putUpdateUser);
routerAPI.delete('/delete-users/:id', checkRole(['admin']), deleteUser);
routerAPI.get('/profile', checkLoggedIn, getProfileByToken)
routerAPI.put('/update-profile', checkLoggedIn, updateUserProfileByToken)

routerAPI.get('/all-cinema', checkRole(['admin']), getAllCinema)
routerAPI.post('/create-cinema', checkRole(['admin']), postCreateCinema)
routerAPI.put('/update-cinema', checkRole(['admin']), putUpdateCinema)
routerAPI.delete('/delete-cinema/:id', checkRole(['admin']), deleteCinema)
routerAPI.get('/province-cinema', checkLoggedIn, getProvincesCinema)
routerAPI.get('/cinema-by-province', checkLoggedIn, getCinemaByProvince)

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
routerAPI.get('/search-movie', checkRole(['admin']), searchMovieByName)
routerAPI.get('/find-movie-by-id/:id', checkRole(['admin']), getMovieById)


routerAPI.post('/add-seat-price', checkRole(['admin']), postCreateSeatPrice)
routerAPI.get('/all-seat-price', checkRole(['admin']), getAllSeatPrice)
routerAPI.put('/update-seat-price', checkRole(['admin']), putUpdateSeatPrice)
routerAPI.delete('/delete-seat-price/:id', checkRole(['admin']), deleteSeatPrice)

routerAPI.post('/create-room', checkRole(['admin']), postCreateRoom)
routerAPI.get('/all-room', checkRole(['admin']), getAllRoom)

routerAPI.post('/create-show-time', checkRole(['admin']), postCreateShowTime)
routerAPI.get('/all-show-time', checkRole(['admin']), getAllShowTime)
routerAPI.put('/update-show-time', checkRole(['admin']), updateShowTime)
routerAPI.delete('/delete-show-time/:id', checkRole(['admin']), deleteShowTime)
routerAPI.get('/showtime/all-dates', checkRole(['admin']), showTimeByDate)

routerAPI.post('/add-food', checkRole(['admin']), addFood)
routerAPI.get('/all-food', checkRole(['admin']), getAllFood)
routerAPI.put('/update-food', checkRole(['admin']), putUpdateFood)
routerAPI.delete('/delete-food/:id', checkRole(['admin']), deleteFood)



module.exports = routerAPI