const cartModel = require('../model/cartmodel')
const userModel = require('../model/usermodel')
const prodModel = require('../model/productmodel')
const validator = require('../middleware/validation')
const productModel = require('../model/productmodel')
const createCart = async (req, res) => {
    try {

        const data = req.body
        const UserId = req.params.userId

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, meassage: "please enter data in body " })
        }

        if (!validator.isValidObjectId(UserId)) {
            return res.status(400).send({ status: false, message: "Enter valid UserId" })
        }
        if (!validator.isValidObjectId(req.body.userId)) {
            return res.status(400).send({ status: false, message: "Enter valid UserId" })
        }


        if (req.decodedT.UserId == UserId) {
            let prevCart = await cartModel.findOne({ userId: UserId })

            if (!prevCart || prevCart == null) {
                const { items } = data

                if (items.length == 0) {
                    return res.status(400).send({ status: false, message: "enter items to add" })
                }

                if (items[0].quantity == 0) {
                    return res.status(400).send({ status: false, message: "Enter valid quantity" })
                }

                let productId = items[0].productId

                let productDetails = await prodModel.findById(productId)
                if (!productDetails) {
                    return res.status(400).send({ status: false, message: "enter valiad product id" })
                }

                

                let totalValue = productDetails.price * items[0].quantity
                data.totalPrice = totalValue
                // let totalItems = items.length
                // data.totalItems = totalItems

                let cart = await cartModel.create(data)

                let updateprod= await productModel.findOneAndUpdate({_id:productId},{$set:{isSaved:true}})
                
                return res.status(201).send({ status: true, message: "cart data created successfully", data: cart })

            } else {
                if (!validator.isValidObjectId(req.body.cartId)) {
                    return res.status(400).send({ status: false, message: "cartid is not valid" })
                }
                let newitems = prevCart.items
                let filter = {}
                const { items } = data
                if (items.length == 0) {
                    return res.status(400).send({ status: false, message: "enter items to add" })
                }

                if (items[0].quantity == 0) {
                    return res.status(400).send({ status: false, message: "Enter valid quantity" })
                }

                let productId = items[0].productId

                let productDetails = await prodModel.findById(productId)
                if (!productDetails) {
                    return res.status(400).send({ status: false, message: "enter valiad product id" })
                }

                let newQuanity = items[0].quantity
                let newPrice = productDetails.price * items[0].quantity
                console.log(data.items[0].quantity)

                let initial = 0
                for (let i = 0; i < prevCart.items.length; i++) {
                    if (prevCart.items[i].productId == productId) {
                        newitems[i].quantity = prevCart.items[i].quantity + newQuanity
                        initial = 1
                        console.log("hi+ match")
                    }
                }

                if (initial == 0) {
                    newitems.push(items[0])
                }
                console.log(initial)

                tatalvalue = prevCart.totalPrice + newPrice



                let upCart = await cartModel.findOneAndUpdate({ userId: UserId }, { $set: { items: newitems, totalPrice: tatalvalue } }, { new: true })
                
                let updateprod= await productModel.findOneAndUpdate({_id:productId},{$set:{isSaved:true}})
                
                return res.status(200).send({ status: true, message: "cart data added successfully in a cart", data: upCart })
            }
        }
        else {
            return res.status(403).send({ status: false, message: "authorizatin denied" })
        }


    } catch (err) {

        return res.status(500).send({ status: false, message: err.message })

    }
}


module.exports.createCart=createCart;