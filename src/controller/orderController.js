const orderModel = require('../model/ordermodel')
const cartModel = require('../model/cartmodel')
const validator = require('../middleware/validation')
const userModel = require('../model/usermodel')
const productModel = require('../model/productmodel')


const createOrder = async (req, res) => {
    try {
        let data = req.body
        let Userid = req.params.userId


        if (!validator.isValidObjectId(Userid)) {
            return res.status(400).send({ status: false, message: "Enter valid UserId" })
        }

        if (req.decodedT.UserId = Userid) {
            let user = await userModel.findById(Userid)
            if (!user) {
                return res.status(400).send({ status: false, message: "user is not present" })
            }

            let cartDeatils = await cartModel.findOne({ userId: Userid })

            data.userId = Userid   // assigning userid to req body

            const itemList = cartDeatils.items
            data.items = itemList     // assigning items to req body


            data.totalPrice = cartDeatils.totalPrice  // assigning totalprice to req body

            

            let totalquantitye = 0
            for (let i = 0; i < itemList.length; i++) {
                totalquantitye += itemList[i].quantity
            }


            data.totalQuantity = totalquantitye  

            let order = await orderModel.create(data)

            return res.status(201).send({ status: true, message: "order created succefully", data: order })


        } else {
            return res.status(403).send({ status: false, message: "authorizatin denied" })
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



const getorder=async(req,res)=>{
      
    try{

        let userid=req.params.userid;
        if (!validator.isValidObjectId(userid)) {
            return res.status(400).send({ status: false, message: "userid is not valid" })
         }

         if(req.decodedT.UserId===userid){

             let pastorders= await orderModel.find({userId:userid});   

             return res.status(200).send({msg:"list of order records",data:pastorders})
         }else{
            return res.status(403).send({ status: false, message: "Authorization denied" })
         }

    }catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.createOrder=createOrder;
module.exports.getorder=getorder
