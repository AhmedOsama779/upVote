import { Schema, model } from 'mongoose'

const replySchema = new Schema({
    replyBody: {
        type: String,
        required: true
    },
    replyBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comment_id: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    reply_id: {
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    }]

}, {
    timestamps: true
})


// model
const replyModel = model.Reply || model('Reply', replySchema)

export default replyModel