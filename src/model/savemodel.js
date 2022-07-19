const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const saveSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "userPro",
        required: true,
        trim: true
    },
    saved: [{
        productId: { type: ObjectId, ref: "ProductPro", required: true ,trim: true},
        isSaved: { type: Boolean,default:true}
    }],


}, { timestamps: true })

module.exports = mongoose.model('savePro', saveSchema)