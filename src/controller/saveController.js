
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
        

        let prevsaved=await saveModel.findOne({userId:userid})

        if(prevsaved){
            let newsaved = prevsaved.saved
            let ns={}

            let initial = 0
                for (let i = 0; i < prevsaved.saved.length; i++) {
                    if (prevsaved.saved[i].productId == productid) {
                       
                        initial = 1
                        
                    }
                }
                //let pro=await productModel.findById(productid)
                ns['productId']=productid

                ns['isSaved']=true;
                if (initial == 0) {
                    newsaved.push(ns)
                } 
            
                let updata = await saveModel.findOneAndUpdate({ userId: userid }, { $set: { saved:newsaved} }, { new: true })

                return res.status(200).send({msg:"saved data",data:updata})
        
        }else{
            body.userId=userid; 
            console.log(body)
            let saving={}

            saving['productId']=productid;
            
            body.saved=saving
            // body.saved.isSaved=true      
            console.log(body)

            let data=await saveModel.create(body)

            return res.status(200).send({msg:"product saved",data:data})
        }

        
    }catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }

}


module.exports.addTosave=addTosave;