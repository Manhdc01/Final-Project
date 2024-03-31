const express = require('express')
const routerAPI = express.Router()

const { postCreateAdmin, getAllAdmin, putUpdateAdmin, deleteAdmin } = require('../controllers/adminController')
const { getAllStaff, postCreateStaff, putUpdateStaff, deleteAStaff } = require('../controllers/staffController')
const { postCreateCustomer, getAllCustomer, putUpdateCustomer, deleteCustomer } = require('../controllers/customerController')
const { postCreateAccount, getAllAccount, putUpdateAccount, deleteAccount } = require('../controllers/accountController')
const { getAllCinema, postCreateCinema, putUpdateCinema, deleteCinema } = require('../controllers/CinemaController')
const { getAllDirector, postCreateADirector, putUpdateADirector, deleteADirector } = require('../controllers/directorController')
const { getAllActor, postCreateActor, putUpdateActor, deleteActor } = require('../controllers/actorController')
const { getAllCategory, postCreateCategory, putUpdateCategory, deleteCategory } = require('../controllers/categoryController')

routerAPI.get('/admin', getAllAdmin)
routerAPI.post('/admin', postCreateAdmin)
routerAPI.put('/admin', putUpdateAdmin)
routerAPI.delete('/admin', deleteAdmin)

routerAPI.get('/staff', getAllStaff)
routerAPI.post('/staff', postCreateStaff)
routerAPI.put('/staff', putUpdateStaff)
routerAPI.delete('/staff', deleteAStaff)

routerAPI.get('/customer', getAllCustomer)
routerAPI.post('/customer', postCreateCustomer)
routerAPI.put('/customer', putUpdateCustomer)
routerAPI.delete('/customer', deleteCustomer)

routerAPI.get('/account', getAllAccount)
routerAPI.post('/account', postCreateAccount)
routerAPI.put('/account', putUpdateAccount)
routerAPI.delete('/account', deleteAccount)


routerAPI.get('/cinema', getAllCinema)
routerAPI.post('/cinema', postCreateCinema)
routerAPI.put('/cinema', putUpdateCinema)
routerAPI.delete('/cinema', deleteCinema)

routerAPI.get('/director', getAllDirector)
routerAPI.post('/director', postCreateADirector)
routerAPI.put('/director', putUpdateADirector)
routerAPI.delete('/director', deleteADirector)

routerAPI.get('/actor', getAllActor)
routerAPI.post('/actor', postCreateActor)
routerAPI.put('/actor', putUpdateActor)
routerAPI.delete('/actor', deleteActor)

routerAPI.get('/category', getAllCategory)
routerAPI.post('/category', postCreateCategory)
routerAPI.put('/category', putUpdateCategory)
routerAPI.delete('/category', deleteCategory)


module.exports = routerAPI