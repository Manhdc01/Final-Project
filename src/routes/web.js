const express = require('express')
const routerAPI = express.Router()
const passport = require('passport')
const paypal = require('paypal-rest-sdk')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const axios = require('axios')


const { getAllCinema, postCreateCinema, putUpdateCinema, deleteCinema, getProvincesCinema,
    getCinemaByProvince, totalCinema } = require('../controllers/cinemaController')
const { getAllCategory, postCreateCategory, putUpdateCategory, deleteCategory } = require('../controllers/categoryController')
const { registerUser, loginUser, requestAccessToken, logOutUser } = require('../controllers/authController')
const { checkLoggedIn, checkRole, validateUserData, setAllParam } = require('../middleware/authMiddleware')
const { postCreateUser, getAllUser, putUpdateUser, deleteUser, getSortedUsersAscending, getSortedUsersDescending
    , searchUsersByName, getProfileByToken, updateUserProfileByToken, getAllAdminCinema,
    totalAccountCustomer, totalAccountStaff, totalAccountStaffInCinema } = require('../controllers/userController')
const { changePassword, forgotPassword, resetPassword } = require('../controllers/chagePasswordController')
const { getAllMovie, postCreateMovie, putupdateMovie, deleteMovie, getMovieNowShowing, getMovieUpcoming,
    getMovieTrailer, searchMovieByName, getMovieById, getTotalMovies } = require('../controllers/movieController')
const { postCreateSeatPrice, getAllSeatPrice, putUpdateSeatPrice, deleteSeatPrice } = require('../controllers/seatPriceController')
const { postCreateRoom, getAllRoom, getAllRoomsInCinema } = require('../controllers/roomController')
const { postCreateShowTime, getAllShowTime, updateShowTime, deleteShowTime,
    showTimeByDate, showTimeByMovieId, checkForOverlap,
    getAllShowTimesForAdminCinema, postCreateShowTimeForAdminCinema,
    putUpdateShowTimeForAdminCinema, deleteShowTimeForAdminCinema, showTimeByCinema } = require('../controllers/showTimeController')
const { addFood, getAllFood, putUpdateFood, deleteFood } = require('../controllers/foodController')
const { getAllMovieAdminCinema, addMovieToCinema, deleteMovieFromCinema, updateMovieFromCinema,
    totalMovieForAdminCinema
} = require('../controllers/movieCinemaController')
const { postCreateBooking, saveUserBooking, getBookingByUser, seatStatus,
    percentageNorAndVIPSeats, revenueByDay, revenueByDayForAdminCinema,
    percentageNorAndVIPSeatsForAdminCinema, totalTicketSoldInCinema, totalRevenueInCinema,
    saveSeatsHold, seatStatusHold, deleteSeatsHold } = require('../controllers/bookingController')
const { createPayment } = require('../controllers/paypalController')

routerAPI.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

routerAPI.get('/google/redirect',
    passport.authenticate('google', { failureRedirect: '/profile' }),
    (req, res) => {
        // On successful authentication, set HTTP-only cookie and redirect
        console.log("User profile:", req.user);
        const payload = {
            googleId: req.user.googleId,
            userId: req.user._id,
            name: req.user.name,
            email: req.user.email,
            image: req.user.image,
            role: req.user.role,
            // Add other relevant user data here
        };
        // Generate the JWT token
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.cookie('accessToken', token, { httpOnly: true, secure: true }); // Ensure 'secure' is true in production
        // Optionally set non-sensitive data in a non-HTTP-only cookie or send it as JSON
        res.cookie('userInfo', JSON.stringify({ name: req.user.name, image: req.user.image }), { secure: true, httpOnly: false });
        res.redirect(`https://dc-cinema.vercel.app/home?token=${token}`); // Make sure the redirect URL is correct for your front-end app
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
routerAPI.get('/all-users', checkRole(['admin']), getAllUser);
routerAPI.get('/all-admin-cinema', checkRole(['admin']), getAllAdminCinema)
routerAPI.post('/create-users', checkRole(['admin']), postCreateUser);
routerAPI.put('/update-users', checkRole(['admin']), putUpdateUser);
routerAPI.delete('/delete-users/:id', checkRole(['admin']), deleteUser);
routerAPI.get('/profile', checkLoggedIn, getProfileByToken)
routerAPI.put('/update-profile', checkLoggedIn, updateUserProfileByToken)
routerAPI.get('/total-account-customer', checkRole(['admin']), totalAccountCustomer)
routerAPI.get('/total-account-staff', checkRole(['admin']), totalAccountStaff)
routerAPI.get('/total-account-staff-in-cinema', checkRole(['admin cinema']), totalAccountStaffInCinema)

routerAPI.get('/all-cinema', checkRole(['admin']), getAllCinema)
routerAPI.get('/cinemas', checkRole(['admin', 'admin cinema']), setAllParam, getAllCinema)
routerAPI.post('/create-cinema', checkRole(['admin']), postCreateCinema)
routerAPI.put('/update-cinema', checkRole(['admin']), putUpdateCinema)
routerAPI.delete('/delete-cinema/:id', checkRole(['admin']), deleteCinema)
routerAPI.get('/province-cinema', checkLoggedIn, getProvincesCinema)
routerAPI.get('/cinema-by-province', checkLoggedIn, getCinemaByProvince)
routerAPI.get('/all-room-cinema/:cinemaId', checkLoggedIn, getAllRoomsInCinema)
routerAPI.get('/total-cinema', totalCinema)

routerAPI.get('/all-category', checkRole(['admin']), getAllCategory)
routerAPI.post('/create-category', checkRole(['admin']), postCreateCategory)
routerAPI.put('/update-category', checkRole(['admin']), putUpdateCategory)
routerAPI.delete('/delete-category/:id', checkRole(['admin']), deleteCategory)

routerAPI.get('/all-movie', checkRole(['admin', 'admin cinema']), getAllMovie)
routerAPI.get('/movies', checkRole(['admin', 'admin cinema']), setAllParam, getAllMovie)
routerAPI.post('/create-movie', checkRole(['admin']), postCreateMovie)
routerAPI.put('/update-movie', checkRole(['admin']), putupdateMovie)
routerAPI.delete('/delete-movie/:id', checkRole(['admin']), deleteMovie)
routerAPI.get('/movie-now-showing', getMovieNowShowing)
routerAPI.get('/movie-upcoming', getMovieUpcoming)
routerAPI.get('/movies/trailer/:movieId', getMovieTrailer);
routerAPI.get('/search-movie', checkRole(['admin']), searchMovieByName)
routerAPI.get('/find-movie-by-id/:id', checkRole(['admin']), getMovieById)
routerAPI.get('/total-movies', getTotalMovies)


routerAPI.post('/add-seat-price', checkRole(['admin']), postCreateSeatPrice)
routerAPI.get('/all-seat-price', checkRole(['admin', 'customer']), getAllSeatPrice)
routerAPI.put('/update-seat-price', checkRole(['admin']), putUpdateSeatPrice)
routerAPI.delete('/delete-seat-price/:id', checkRole(['admin']), deleteSeatPrice)

routerAPI.post('/create-room', checkRole(['admin']), postCreateRoom)
routerAPI.get('/all-room', checkRole(['admin']), getAllRoom)

routerAPI.post('/create-show-time', checkRole(['admin']), postCreateShowTime)
routerAPI.get('/all-show-time', checkRole(['admin']), getAllShowTime)
routerAPI.put('/update-show-time', checkRole(['admin']), updateShowTime)
routerAPI.delete('/delete-show-time/:id', checkRole(['admin']), deleteShowTime)
routerAPI.get('/showtime/all-dates', checkRole(['admin', 'admin cinema']), showTimeByDate)
routerAPI.get('/show-time-by-cinema', checkRole(['admin cinema']), showTimeByCinema)
routerAPI.get('/showtime-by-movie/:movieId', checkLoggedIn, showTimeByMovieId)
routerAPI.get('/duplicates', checkRole(['admin', 'admin cinema']), checkForOverlap)
routerAPI.get('/admin-cinema/showtimes', checkRole(['admin cinema']), getAllShowTimesForAdminCinema)
routerAPI.post('/admin-cinema/create-showtime', checkRole(['admin', 'admin cinema']), postCreateShowTimeForAdminCinema)
routerAPI.put('/admin-cinema/update-showtime', checkRole(['admin', 'admin cinema']), putUpdateShowTimeForAdminCinema)
routerAPI.delete('/admin-cinema/delete-showtime/:id', checkRole(['admin', 'admin cinema']), deleteShowTimeForAdminCinema)

routerAPI.post('/add-food', checkRole(['admin']), addFood)
routerAPI.get('/all-food', checkRole(['admin', 'customer']), getAllFood)
routerAPI.put('/update-food', checkRole(['admin']), putUpdateFood)
routerAPI.delete('/delete-food/:id', checkRole(['admin']), deleteFood)

routerAPI.get('/all-movie-admin-cinema', checkRole(['admin', 'admin cinema']), getAllMovieAdminCinema)
routerAPI.post('/add-movie-to-cinema', checkRole(['admin', 'admin cinema']), addMovieToCinema)
routerAPI.put('/update-movie-from-cinema', checkRole(['admin', 'admin cinema']), updateMovieFromCinema)
routerAPI.delete('/delete-movie-from-cinema/:id', checkRole(['admin', 'admin cinema']), deleteMovieFromCinema)
routerAPI.get('/total-movie-cinema', totalMovieForAdminCinema)

routerAPI.post('/create-booking', postCreateBooking)
routerAPI.post('/save-booking', saveUserBooking)
routerAPI.get('/history-purchase/:id', getBookingByUser)
routerAPI.get('/seats/status', seatStatus)
routerAPI.get('/seat-percentages', percentageNorAndVIPSeats)
routerAPI.get('/revenue-by-day', revenueByDay)
routerAPI.get('/seat-percentages-admin-cinema', checkRole(['admin cinema']), percentageNorAndVIPSeatsForAdminCinema)
routerAPI.get('/revenue-admin-cinema', checkRole(['admin cinema']), revenueByDayForAdminCinema)
routerAPI.get('/total-ticket-sold-in-cinema', checkRole(['admin cinema']), totalTicketSoldInCinema)
routerAPI.get('/total-revenue-in-cinema', checkRole(['admin cinema']), totalRevenueInCinema);
routerAPI.post('/hold-seats', saveSeatsHold)
routerAPI.get('/all-seats-hold', seatStatusHold)
routerAPI.delete('/delete-seats-hold/:id', deleteSeatsHold)


routerAPI.get('/paypal', (req, res) => {
    res.render('paypal.ejs')
})


routerAPI.get('/success', (req, res) => {
    const { total, currency } = req.query;
    console.log(req.query)
    console.log('Total:', total, 'Currency:', currency)
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
        "payer_id": PayerID,
        "transactions": [{
            "amount": {
                "currency": currency,
                "total": total
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.error(error.response);
            res.status(500).json({ error: "Payment execution failed", details: error.response });
        } else {
            if (payment.transactions[0].amount.total !== total || payment.transactions[0].amount.currency !== currency) {
                res.status(400).json({ error: "Transaction amount mismatch" });
            } else {
                res.status(200).json({
                    message: "Payment executed successfully",
                    paymentId: paymentId,
                    PayerID: PayerID,
                    paymentDetails: payment
                });
            }
        }
    });
});

routerAPI.post('/create-payment', async (req, res) => {
    const { total, currency, name } = req.body;
    console.log('Total:', total, 'Currency:', currency, 'Name:', name)

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://dc-cinema.vercel.app/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": name || 'Ticket Purchase',
                    "price": total,
                    "currency": currency,
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": currency,
                "total": total
            },
            "description": "Description of the payment"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.error('Error creating payment:', error);
            res.status(500).json({ error: 'Error creating payment' });
        } else {
            const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
            if (approvalUrl) {
                res.json({ approvalUrl: approvalUrl.href });
                console.log('Approval URL:', approvalUrl.href);
            } else {
                res.status(500).json({ error: 'No approval URL found' });
            }
        }
    });
});

module.exports = routerAPI