const express = require('express')
const { route } = require('express/lib/application')
const res = require('express/lib/response')
const router = express.Router()
const userController = require('../controller/userController')
const auth = require('../middleware/middleware')
const productController = require('../controller/productController')
const cartController = require('../controller/cartController')
const orderController = require('../controller/orderController')


// user Api
router.post('/register' ,userController.registration)

router.post('/login' , userController.loginUser)



// product Api
router.post('/products/:userid' , auth.authentication,productController.createProduct)


router.get('/products/:userid',auth.authentication, productController.getlist)

router.get('/products/:userid/:productid' ,auth.authentication, productController.getAlldetails)



// CART API
router.post('/users/:userId/cart',auth.authentication, cartController.createCart )




// order api
router.post('/users/:userId/orders' ,auth.authentication, orderController.createOrder)

router.get('/users/:userid/orders', auth.authentication, orderController.getorder)



module.exports = router