import commModel from "../../../DB/models/comment.model.js"
import proModel from "../../../DB/models/product.model.js"
import replyModel from "../../../DB/models/reply.model.js"


//============================== Add Comment ================================
export const addComment = async (req, res, next) => {
    const { commBody, productId } = req.body
    const product = await proModel.findOne({ _id: productId })
    if (!product) {
        return next(new Error('invalid product id', { cause: 400 }))
    }
    const newComment = new commModel({
        commBody,
        commBy: req.user._id,
        productID: productId
    })
    await newComment.save()
    // $push  => $addToSet
    const check = await proModel.updateOne({ _id: productId }, {
        $addToSet: {
            comments: newComment._id
        }
    })
    if (!check.modifiedCount) {
        return next(new Error('Pushing fail', { cause: 400 }))
    }
    res.status(201).json({ message: "Done", newComment })
}


//========================= delete comment ===============
export const deleteComment = async (req, res, next) => {
    const { commentId } = req.params
    const { _id } = req.user
    const comment = await commModel.findOneAndDelete({ _id: commentId, commBy: _id })
    if (!comment) {
        return next(new Error('Delete comment fail', { cause: 403 }))
    }
    const check = await proModel.updateOne({ _id: comment.productID }, {
        $pull: {
            comments: commentId
        }
    })
    if (!check.modifiedCount) {
        return next(new Error('Pushing fail', { cause: 400 }))
    }
    res.status(200).json({ message: "Deleted Done" })
}


/*********************************************   Replies APIs  ************************************************* */

// ==================================== Add reply =======================
export const addReply = async (req, res, next) => {
    const { replyBody, comment_id } = req.body
    const { _id } = req.user
    const isCommentExist = await commModel.findById(comment_id)
    if (!isCommentExist) {
        return next(new Error('in-valid comment id', { cause: 400 }))
    }
    const newReply = new replyModel({
        replyBody,
        comment_id,
        replyBy: _id
    })

    const savedReply = await newReply.save()
    const check = await commModel.updateOne({ _id: comment_id }, {
        $addToSet: {
            replies: newReply._id
        }
    })
    if (!check.modifiedCount) {
        return next(new Error('Pushing fail', { cause: 400 }))
    }
    res.status(201).json({ message: "reply added Done", savedReply })
}

//===================================== reply on Reply =================================
export const addReplyOnReply = async (req, res, next) => {
    const { replyBody, reply_id } = req.body
    const { _id } = req.user
    const isReplyExist = await replyModel.findById(reply_id)
    if (!isReplyExist) {
        return next(new Error('in-valid comment id', { cause: 400 }))
    }
    const newReply = new replyModel({
        replyBody,
        reply_id,
        replyBy: _id
    })

    const savedReply = await newReply.save()
    const check = await replyModel.updateOne({ _id: reply_id }, {
        $addToSet: {
            replies: newReply._id
        }
    })
    if (!check.modifiedCount) {
        return next(new Error('Pushing fail', { cause: 400 }))
    }
    res.status(201).json({ message: "reply added Done", savedReply })

}
