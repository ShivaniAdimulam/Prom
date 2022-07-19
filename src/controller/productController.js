const productModel = require('../model/productmodel')
const validator = require('../middleware/validation')
const aws = require('../middleware/awsConfig')
const usermodel = require('../model/usermodel')



const createProduct = async (req, res) => {
    try {
        const data = req.body
        let userid=req.params.userid;
        
        if (!validator.isValidObjectId(userid)) {
            return res.status(400).send({ status: false, message: "userid is not valid" })
         }
        
        if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, message: "Please enter Data in body" }) }

        const { title, description, price, currencyId, currencyFormat, availableSizes, installments } = data

        if (!validator.isvalid(title)) {
            return res.status(400).send({ status: false, message: "enter title...it is required" })
        }

        const prevTitle = await productModel.findOne({ title: title })
        if (prevTitle) {
            return res.status(400).send({ status: false, message: "Title is already exist...use another one " })
        }

        if (!validator.isvalid(description)) {
            return res.status(400).send({ status: false, message: "enter description...it is required" })
        }


        if (!validator.isvalid(price)) {
            return res.status(400).send({ status: false, message: "enter price...it is required" })
        }
        const convertPrice = Number(price)
        if (isNaN(convertPrice)) {

            return res.status(400).send({ status: false, message: "enter price...it should be number/decimal form" })
        }
        if (price < 1) {
            return res.status(400).send({ status: false, message: "please enter valid price" })
        }


        if (!validator.isvalid(currencyId)) {
            return res.status(400).send({ status: false, message: "enter currencyId...it is required" })
        }
        const CurrencyIds = ['INR', 'USD', 'EUR', 'JPY']
        if (!CurrencyIds.includes(currencyId.trim())) {
            return res.status(400).send({ status: false, message: "enter currencyId format correct you can use ['INR' , 'USD' , 'EUR' ,] it is required" })
        }

       

        const productPic = req.files
        if (productPic && productPic.length > 0) {

            let uploadedFileURL = await aws.productuploadFile(productPic[0])
            data.productImage = uploadedFileURL
        }
        // else {
        //     return res.status(400).send({ message: "No file found" })
        // }

        if (installments) {
            if (isNaN(installments)) {
                return res.status(400).send({ status: false, message: "please enter number of month in installment" })
            }
            const changeInstallement = Number(installments)
            const Installments = [3, 6, 9, 12, 24]
            if (!Installments.includes(changeInstallement)) {
                return res.status(400).send({ status: false, message: "please enter valild Installments ['3' , '6' , '9' , '12' , '24] this is required" })
            }
        }


        let admin= await usermodel.findById(userid)

        if(admin.isAdmin){
        if(req.decodedT.UserId===userid ){
        const createProduct = await productModel.create(data)
        return res.status(201).send({ status: true, message: "product created successfully", data: createProduct })
        }else{
            return res.status(403).send({ status: false, message: "Authorization denied" })
         }
        }else{
            return res.status(400).send({msg:"You are not admin hence You cant create product"})
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }

}


const getlist=async(req,res) =>{
     try{

        let userid=req.params.userid;
        if (!validator.isValidObjectId(userid)) {
            return res.status(400).send({ status: false, message: "userid is not valid" })
         }

         if(req.decodedT.UserId===userid){

        let listofprod= await productModel.find().select({title:1,description:1,isSaved:1,price:1})    // here we can apply select function two get only selected fields of product.select({title:1,description:1,isSaved:1,price:1})

        return res.status(200).send({msg:"list of product is",data:listofprod})
         }else{
            return res.status(403).send({ status: false, message: "Authorization denied" })
         }

     }catch(err){
        return res.status(500).send({status: false,msg:err.message})

     }
}


const getAlldetails=async(req,res)=>{
      try{
        
        let userid=req.params.userid;
        if (!validator.isValidObjectId(userid)) {
            return res.status(400).send({ status: false, message: "userid is not valid" })
         }
        let productid=req.params.productid;
        
        if (!validator.isValidObjectId(productid)) {
            return res.status(400).send({ status: false, message: "Please provide valid productid" })
        }

        if(req.decodedT.UserId===userid){
        
        let prod=await productModel.findById({_id:productid,isDeleted:false})

        if(!prod){
            return res.status(404).send({status:false,msg:"no product found"})
        }

        return res.status(200).send({msg:"Product found...details are as follows", data:prod})
       }else{
        return res.status(403).send({ status: false, message: "Authorization denied" })
     }

      }catch(err){
        return res.status(500).send({status: false,msg:err.message})

      }
}



module.exports.createProduct=createProduct;
module.exports.getlist=getlist;
module.exports.getAlldetails=getAlldetails;