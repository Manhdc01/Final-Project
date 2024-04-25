const express = require('express')
const routerAPI = express.Router()
const passport = require('passport')
const paypal = require('paypal-rest-sdk')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const axios = require('axios')


const { getAllCinema, postCreateCinema, putUpdateCinema, deleteCinema, getProvincesCinema,
    getCinemaByProvince } = require('../controllers/cinemaController')
const { getAllCategory, postCreateCategory, putUpdateCategory, deleteCategory } = require('../controllers/categoryController')
const { registerUser, loginUser, requestAccessToken, logOutUser } = require('../controllers/authController')
const { checkLoggedIn, checkRole, validateUserData } = require('../middleware/authMiddleware')
const { postCreateUser, getAllUser, putUpdateUser, deleteUser, getSortedUsersAscending, getSortedUsersDescending
    , searchUsersByName, getProfileByToken, updateUserProfileByToken, getAllAdminCinema } = require('../controllers/userController')
const { changePassword, forgotPassword, resetPassword } = require('../controllers/chagePasswordController')
const { getAllMovie, postCreateMovie, putupdateMovie, deleteMovie, getMovieNowShowing, getMovieUpcoming,
    getMovieTrailer, searchMovieByName, getMovieById } = require('../controllers/movieController')
const { postCreateSeatPrice, getAllSeatPrice, putUpdateSeatPrice, deleteSeatPrice } = require('../controllers/seatPriceController')
const { postCreateRoom, getAllRoom } = require('../controllers/roomController')
const { postCreateShowTime, getAllShowTime, updateShowTime, deleteShowTime,
    showTimeByDate, showTimeByMovieId } = require('../controllers/showTimeController')
const { addFood, getAllFood, putUpdateFood, deleteFood } = require('../controllers/foodController')
const { getAllMovieAdminCinema, addMovieToCinema } = require('../controllers/movieCinemaController')
const { postCreateBooking } = require('../controllers/bookingController')
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
        res.redirect(`http://localhost:3001/home?token=${token}`); // Make sure the redirect URL is correct for your front-end app
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
routerAPI.get('/all-admin-cinema', checkRole(['admin']), getAllAdminCinema)
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

routerAPI.get('/all-movie', checkRole(['admin', 'admin cinema']), getAllMovie)
routerAPI.post('/create-movie', checkRole(['admin']), postCreateMovie)
routerAPI.put('/update-movie', checkRole(['admin']), putupdateMovie)
routerAPI.delete('/delete-movie/:id', checkRole(['admin']), deleteMovie)
routerAPI.get('/movie-now-showing', getMovieNowShowing)
routerAPI.get('/movie-upcoming', getMovieUpcoming)
routerAPI.get('/movies/trailer/:movieId', getMovieTrailer);
routerAPI.get('/search-movie', checkRole(['admin']), searchMovieByName)
routerAPI.get('/find-movie-by-id/:id', checkRole(['admin']), getMovieById)


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
routerAPI.get('/showtime/all-dates', checkRole(['admin']), showTimeByDate)
routerAPI.get('/showtime-by-movie/:movieId', checkLoggedIn, showTimeByMovieId)

routerAPI.post('/add-food', addFood)
routerAPI.get('/all-food', checkRole(['admin', 'customer']), getAllFood)
routerAPI.put('/update-food', checkRole(['admin']), putUpdateFood)
routerAPI.delete('/delete-food/:id', checkRole(['admin']), deleteFood)

routerAPI.get('/all-movie-admin-cinema', checkRole(['admin cinema']), getAllMovieAdminCinema)
routerAPI.post('/add-movie-to-cinema', checkRole(['admin cinema']), addMovieToCinema)

routerAPI.post('/create-booking', postCreateBooking)

routerAPI.get('/paypal', (req, res) => {
    res.render('paypal.ejs')
})

// routerAPI.post('/create-payment', checkLoggedIn, createPayment);
routerAPI.get('/success', (req, res) => {
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
        "payer_id": PayerID,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "10.00"
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.error(error.response);
            res.status(500).send("Payment execution failed");
        } else {
            // Redirect to the React route handling the confirmation
            res.redirect(`http://localhost:3000/success?paymentId=${paymentId}&PayerID=${PayerID}`);
        }
    });
});

routerAPI.post('/create-payment', async (req, res) => {
    const clientID = 'ARJRbC7-R6guvxhINoQkkJzriCZ-OfmLAJ-RSYyqVmQ6IWG0K8l-VtVeFa9H6Z9j1QreCfyBxBXRqwJg';
    const secret = 'EGKFytFEyflJKpF-Y7piQXLPDE9r_o9YNCoKDTg6eVYZs9E4YTCeX9Wf92EkoEQHcMq6_yap1VcFPdeY';
    const tokenEndpoint = 'https://api.sandbox.paypal.com/v1/oauth2/token';
    const data = {
        grant_type: 'client_credentials'
    };
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientID}:${secret}`).toString('base64')}`
    };

    try {
        const response = await axios.post(tokenEndpoint, new URLSearchParams(data), { headers });
        const accessToken = response.data.access_token;
        console.log(accessToken)

        const paymentData = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: 'http://localhost:3001/success',
                cancel_url: 'http://localhost:3000/cancel'
            },
            transactions: [{
                item_list: {
                    items: [{
                        name: 'item name',
                        price: '10.00',
                        currency: 'USD',
                        quantity: 1
                    }]
                },
                amount: {
                    total: '10.00',
                    currency: 'USD'
                },
                description: 'Description of the payment'
            }]
        };

        const paymentResponse = await axios.post('https://api.sandbox.paypal.com/v1/payments/payment', paymentData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const approvalUrl = paymentResponse.data.links.find(link => link.rel === 'approval_url').href;
        console.log(approvalUrl)
        res.json({ approvalUrl: approvalUrl });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).send('An error occurred while creating payment');
        console.log('PayPal API response:', error.response);
    }
});


module.exports = routerAPI