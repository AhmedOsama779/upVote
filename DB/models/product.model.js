import moment from 'moment';
import { Schema, model } from 'mongoose'

// product model , usermodel 
const proSchema = new Schema({
    title: String,
    caption: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    Images: [{
        type: String,
        required: true
    }],
    publicIds: [{
        type: String,
        required: true
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    unlikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    totalVotes: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
})

//hook
proSchema.post('findOneAndUpdate', async function () {
    const data = this.getQuery()
    // console.log(data);
    const { _id } = this.getQuery()
    // console.log(data);
    const product = await this.model.findOne({ _id })

    product.totalVotes = product.likes.length - product.unlikes.length
    product.__v += 1
    await product.save()
})
// model
const proModel = model.Product || model('Product', proSchema)

export default proModel