const productModel = require('../model/productmodel')
const validator = require('../middleware/validation')
const aws = require('../middleware/awsConfig')
const usermodel = require('../model/usermodel')
const saveModel = require('../model/savemodel')
const savemodel = require('../model/savemodel')



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
        console.log(admin)
       
        if(req.decodedT.UserId===userid ){
            if(admin.isAdmin){
        const createProduct = await productModel.create(data)
        return res.status(201).send({ status: true, message: "product created successfully", data: createProduct })
        }else{
            return res.status(400).send({msg:"You are not admin hence You cant create product"})
            
         }
        }else{
            return res.status(403).send({ status: false, message: "Authorization denied" })
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }

}


// const getlist=async(req,res) =>{
//      try{

//         let userid=req.params.userid;
//         if (!validator.isValidObjectId(userid)) {
//             return res.status(400).send({ status: false, message: "userid is not valid" })
//          }

//          if(req.decodedT.UserId===userid){
//         //  let arr=[]      //chan
        
//         // let savedd=await saveModel.findOne({userId:userid})
//         // let productdetails=await productModel.find()
//         //  arr.push(productdetails)
//         // //console.log(savedd)
//         // let saveddd=savedd.saved;
//         // console.log(saveddd[0].productId)
        
//         // for(let i=0;i<saveddd.length;i++){
//         //     let prod=saveddd[i].productId
//         //     let check=await productModel.findOne({$match:{_id:prod}})
            
//         //     //console.log(check)
          
//         //     let abc=JSON.parse(JSON.stringify(check))
//         //    abc['isSaved']=true
//         //     console.log(abc)
            
//         //     arr.push(abc)

//         //     }             /// chan

//     //         for(let i=0;i<arr.length;i++){
//     //             arr[i].isSaved=true
//     //         }

//     //    console.log(arr);

//        let listofprod= await productModel.find()  // here we can apply select function two get only selected fields of product.select({title:1,description:1,isSaved:1,price:1})
        
//         let usersave=await saveModel.find({userId:userid})

//         for(let i=0;i<listofprod.length;i++){
//              let sav=await savemodel.findById({$match:{productId:listofprod[i]._id}})
//              if(sav){
//                 listofprod.splice(i,1)
//                 listofprod.push(sav)
//              }
//         }

//         /// let listofprod=await saveModel.find()
//         return res.status(200).send({msg:"list of product is",data:listofprod })
//           }else{
//            return res.status(403).send({ status: false, message: "Authorization denied" })
//          }

//      }catch(err){
//         return res.status(500).send({status: false,msg:err.message})
   
//      }
// }


// const getlist=async(req,res)=>{
//     try{
//         let userid=req.params.userid;
//         if (!validator.isValidObjectId(userid)) {
//             return res.status(400).send({ status: false, message: "userid is not valid" })
//          }

//          let arr=[]      //chan
       
//           let savedd=await saveModel.findOne({userId:userid})
//           if(savedd){
//          let productdetails=await productModel.find()
//          ///  arr.push(productdetails)
//          // //console.log(savedd)
//           let saveddd=savedd.saved;
//           console.log(saveddd)
//           console.log(saveddd[0].productId)
        
//           for(let i=0;i<saveddd.length;i++){
//               let prod=saveddd[i].productId
//               let check=await productModel.find({$match:{_id:prod}})
//                  check.splice(i,1)
                 
//                  check.push(saveddd)
//                 console.log(check.productId)
//                  arr.push(check)

  
//              //console.log(check)
          
//          //  //   let abc=JSON.parse(JSON.stringify(check))
//          //   // abc['isSaved']=true
//          //     console.log(abc)
            
//          //     //arr.push(abc)
  
//              }             /// chan
  
//              return res.status(200).send({msg:"list of product is",data:arr})
//             }else{
//                 let productdetail=await productModel.find()

//                 return res.status(200).send({msg:"Here is list of products",data:productdetail})
//             }

//     }catch(err){
//         return res.status(500).send({status: false,msg:err.message})
//     }
// }



// const getlist=async(req,res)=>{
//     try{
//         let userid=req.params.userid;
//         if (!validator.isValidObjectId(userid)) {
//             return res.status(400).send({ status: false, message: "userid is not valid" })
//          }

//          let arr=[]      //chan
       
//           let savedd=await saveModel.find({userId:userid})
//           if(savedd){
//          let productdetails=await productModel.find()
//            arr.push(productdetails)
//          // //console.log(savedd)
//          for(let j=0;j<savedd.length;j++){
//           var productid=savedd[j].productId;
//            console.log(productid)

//            var newArr = arr.map(obj => {
//             if (obj._id === productid) {
//               return {...obj, isSaved: 'true'};
//             }
//             console.log(obj)
//             return obj;})
//         //   for(let i=0;i<arr.length;i++){
            
//         //        if(arr[i]._id===productid){
//         //         arr[i].isSaved="true"
//         //         console.log(arr[i].iSaved)
//         //         ///arr.splice(i,1)
//         //         /// arr.push(savedd)
//         //         ///break;
//         //        }
//         //   }
//         }
        

//           return res.status(200).send({msg:"List of products is here",data:newArr})
        
         
//     }      

//     }catch(err){
//         return res.status(500).send({status: false,msg:err.message})
//     }
// }



const getlist=async(req,res)=>{
    try{
        let userid=req.params.userid;
        if (!validator.isValidObjectId(userid)) {
            return res.status(400).send({ status: false, message: "userid is not valid" })
         }

         let arr=[]      //chan
       
          let savedd=await saveModel.findOne({userId:userid})
          if(savedd){
         let productdetails=await productModel.find()
           arr.push(productdetails)
         // //console.log(savedd)
         // let saveddd=savedd.saved;
          //console.log(saveddd)
          //console.log(saveddd[0].productId)
        
          let prod=savedd.productId
              let check=await productModel.findOne({$match:{_id:prod}})
              check.isSaved="true"
             let i= arr.indexOf(check)
             arr.splice(i,0,check)

              arr.push(check)
              //arr.splice(check,0,check)
                //  check.splice(i,1)
                 
                //  check.push(saveddd)
                // console.log(check.productId)
                //  arr.push(check)

  
             //console.log(check)
          
         //  //   let abc=JSON.parse(JSON.stringify(check))
         //   // abc['isSaved']=true
         //     console.log(abc)
            
         //     //arr.push(abc)
  
              /// chan
  
             return res.status(200).send({msg:"list of product is",data:arr})
            }else{
                let productdetail=await productModel.find()

                return res.status(200).send({msg:"Here is list of products",data:productdetail})
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
        
            

            let savedd=await saveModel.findOne({userId:userid,productId:productid})
          if(savedd){
         
              let check=await saveModel.findOne({productId:productid}).populate({path:'productId',select:'title description price currencyId isFreeShipping'})
              return res.status(200).send({msg:"Details of product is here",data:check})
        
          }
        
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





