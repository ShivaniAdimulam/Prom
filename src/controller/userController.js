const validator = require('../middleware/validation')
const userModel = require('../model/usermodel')
const bcrypt = require('bcrypt');
const uploadAws = require('../middleware/awsConfig')
const aws = require("aws-sdk")
const jwt = require('jsonwebtoken');



const registration = async (req, res) => {
    try {
        const data = req.body
        console.log(data);
        
        if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, message: "Please enter Data like firstname lastname" }) }

        const { fname, lname, email, phone, password, address } = data
        if (!validator.isvalid(fname)) { return res.status(400).send({ status: false, massage: "please enter first name" }) }

        if (!validator.isvalid(lname)) { return res.status(400).send({ status: false, massage: "please enter last name" }) }

        if (!validator.isvalid(email)) {
            return res.status(400).send({ status: false, massage: "please enter email" })
        }
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, massage: "please enter correct email" })
        }
        const emailFind = await userModel.findOne({ email: email })
        if (emailFind) {
            return res.status(400).send({ status: false, massage: "Email alrady Exist" })
        }


        if (!validator.isvalid(phone)) { return res.status(400).send({ status: false, massage: "please enter phone" }) }
        if (!validator.isValidPhone(phone)) { return res.status(400).send({ status: false, massage: "Enter Correct mobile Number" }) }
        let mobileNumber = await userModel.findOne({ phone: phone })
        if (mobileNumber) { return res.status(400).send({ status: false, massage: "mobile Number alrady exist" }) }

        if (!validator.isvalid(password)) { return res.status(400).send({ status: false, massage: "please enter password" }) }
        if (password.length < 8 || password.length > 15) { return res.status(400).send({ status: false, massage: "please length should be 8 to 15 password" }) }
        const hash = bcrypt.hashSync(password, 6);
        data.password = hash

       
        const profilePic = req.files
        if (profilePic && profilePic.length > 0) {

            let uploadedFileURL = await uploadAws.uploadFile(profilePic[0])
            data.profileImage = uploadedFileURL
        }
        // else {
        //     return res.status(400).send({ message: "No file found" })
        // }
        const createUser = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User created successfully", data: createUser })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const loginUser = async function (req, res) {
    try {
        const requestbody = req.body;
        if (Object.keys(requestbody).length == 0) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. please provide login details" })
        }

        const { email, password } = requestbody;

        if (!validator.isvalid(email)) {
            return res.status(400).send({ status: false, message: `Email is required` })
        }
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: `Email is not correct ` })
        }

        if (!validator.isvalid(password)) {
            res.status(400).send({ status: false, message: `password is required` })
            return
        }

        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(401).send({ status: false, message: 'email is wrong' })
        }
        const decrpted = bcrypt.compareSync(password, user.password);
        if (decrpted == true) {
            const token = await jwt.sign({
                UserId: user._id,
            }, 'privatekey', { expiresIn: "10h" })

            const abc = res.setHeader('authorization', `Bearer ${token}`);
            console.log(abc)
            return res.status(200).send({ status: true, message: 'User login successfully', data: { userId: user._id, token: token } })
        }
        else {
            res.status(400).send({ status: false, message: "password is incorrect" })
        }

    } catch (err) {

        return res.status(500).send({ status: false, message: err.message })

    }

}


module.exports.registration=registration;
module.exports.loginUser=loginUser;