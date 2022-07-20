
const productModel = require('../model/productmodel')
const saveModel = require('../model/savemodel')
const userModel = require('../model/usermodel')
const validator = require('../middleware/validation')



const addTosave=async(req,res)=>{

    try{
        let body=req.body
        let productid=req.body.productId

        let userid=req.params.userid;

        if (!validator.isValidObjectId(productid)) {
            return res.status(400).send({ status: false, message: "Enter valid productId" })
        }

        if (!validator.isValidObjectId(userid)) {
            return res.status(400).send({ status: false, message: "Enter valid UserId" })
        }

        if (!validator.isvalid(productid)) { return res.status(400).send({ status: false, massage: "please enter productid" }) }

        if (Object.keys(body).length === 0) { return res.status(400).send({ status: false, message: "Please enter Data " }) }
        

        let prevsaved=await saveModel.findOne({userId:userid,productId:productid})
         
       
        if(prevsaved){
            
               return res.status(200).send({msg:"product is already saved",data:prevsaved})
        
        }else{
            body.userId=userid; 
            console.log(body)
           
            let data=await saveModel.create(body)

            return res.status(200).send({msg:"Product saved",data:data})
        }

        
    }catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }

}



module.exports.addTosave=addTosave;



