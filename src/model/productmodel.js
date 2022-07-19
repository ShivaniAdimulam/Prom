const mongoose = require('mongoose')
const prodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    currencyId: {
        type: String,
        required: true,
        trim: true
    },
    
    isFreeShipping: {
        type: Boolean,
        default: false
    },
    productImage: {
        type: String
       
    },
    style: {
        type: String,
        trim: true
    },
    
    installments: { type: Number },
    deletedAt: {
        type: Date,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

    isSaved :{
        type:Boolean,
        default:false
    }


}, { timestamps: true })

module.exports = mongoose.model('ProductPro', prodSchema)