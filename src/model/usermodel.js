const mongoose = require('mongoose')
const userModel = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim:true
    },
    lname: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    profileImage: {
        type: String,
        
        trim:true
    }, 
    phone: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        minLen: 8,
        maxLen: 15,
        trim:true
    }, 

    isAdmin:{
             type:Boolean,
             default:false
            },
    address: {
        shipping: {
            street: { type: String},
            city: { type: String},
            pincode: { type:Number}
        },
        billing: {
            street: { type: String},
            city: { type: String},
            pincode: { type:Number}
        }
    }
}, { timestamps: true })

module.exports = mongoose.model('userPro', userModel)