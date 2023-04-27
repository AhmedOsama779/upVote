import { Schema, model } from 'mongoose'

// comment model , product model  ==> parent-child

// comment model , user model  ==> child-parent
const commSchema = new Schema({
    commBody: {
        type: String,
        required: true
    },
    commBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productID: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    }]

}, {
    timestamps: true
})


// model
const commModel = model.Comment || model('Comment', commSchema)

export default commModel