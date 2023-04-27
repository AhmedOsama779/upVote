
import proModel from "../../../DB/models/product.model.js"
import { pagination } from "../../services/pagination.js"
import cloudinary from "../../utils/cloudinary.js"

//========================== Add product ===========================
export const addProduct = async (req, res, next) => {
    // if (!req.files.length) {
    //     return next(new Error('please select your pictures', { cause: 400 }))
    // }
    const { title, caption } = req.body
    const { _id, firstName } = req.user
    // let imagesArr = [];
    // let publicIdsArr = []

    // for of -------------------- forEach()
    // for (const file of req.files) {
    //     const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
    //         folder: `Product/${firstName}`
    //     })
    //     imagesArr.push(secure_url)
    //     publicIdsArr.push(public_id)
    // }
    const newProduct = new proModel({
        title, caption,
        // Images: imagesArr,
        // publicIds: publicIdsArr,
        createdBy: _id
    })

    await newProduct.save()
    res.status(201).json({ message: "Done", newProduct })
}

///====================== get all products with comments ===================
// export const getAllProducts = async (req, res, next) => {
//     // const products = await proModel.find({})
//     let arr = []
//     // for (const product of products) {
//     //     const comments = await commModel.find({ productID: product._id })
//     //     arr.push({ product, comments })
//     // }
//     const cursor = proModel.find({}).cursor();
//     for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
//         const comments = await commModel.find({ productID: doc._id })
//         console.log(doc); // not an object it's BSON (BinaryJSON)
//         const convertedDoc = doc.toObject()
//         convertedDoc.comments = comments
//         arr.push(convertedDoc)
//     }
//     res.status(200).json({
//         messaga: "Done", arr
//     })
// }
///
export const getAllProducts = async (req, res, next) => {
    const { page, size } = req.query
    const { perPage,
        skip,
        prePage,
        nextPage,
        currentPage } = pagination({ page, size })
    const all = await proModel.find({})
    const products = await proModel
        .find({})
        .populate(
            [
                {
                    path: 'comments',
                    select: 'commBody commBy replies',
                    // match: {
                    //     commBody: 'Comment four'
                    // },
                    populate: [{
                        path: 'commBy',
                        select: '-_id firstName'
                    }, {
                        path: 'replies',
                        select: '-_id replyBody replies',
                        populate: [{
                            path: 'replies',
                            select: '-_id replyBody'
                        }]
                    }]
                }, {
                    path: 'createdBy',
                    select: '-_id firstName'
                }
            ]
        ).limit(perPage).skip(skip)
    if (!products.length) {
        res.status(200).json({
            messaga: "empty products"
        })
    }
    //count()
    const totalPages = Math.ceil(all.length / perPage)
    res.status(200).json({
        messaga: "Done",
        data: {
            products
        },
        meta: {
            skip,
            prePage,
            nextPage,
            currentPage,
            totalPages
        }
    })
}

//================================= Like product ======================
export const likeProduct = async (req, res, next) => {
    const { productId } = req.params
    const { _id } = req.user
    // productId, unlikes isnot contain _id
    const product = await proModel.findOneAndUpdate({ _id: productId, unlikes: { $ne: _id } }, {
        $addToSet: {
            likes: _id
        }
    }, {
        new: true
    })
    if (!product) {
        return next(new Error('product doesnot exist', { cause: 400 }))
    }
    res.status(200).json({ message: "Done" })
}

//=========================== unlike product =========================
export const unlikeProduct = async (req, res, next) => {
    const { productId } = req.params
    const { _id } = req.user
    // productId, unlikes isnot contain _id
    const product = await proModel.findOneAndUpdate({ _id: productId, likes: { $ne: _id } }, {
        $addToSet: {
            unlikes: _id
        }
    }, {
        new: true
    })
    if (!product) {
        return next(new Error('product doesnot exist', { cause: 400 }))
    }
    res.status(200).json({ message: "Done" })
}



//===================== soft delete product ================
export const softDelete = async (req, res, next) => {
    const { _id } = req.body
    const product = await proModel.findOneAndUpdate({ _id, isDeleted: false }, {
        isDeleted: true
    }, {
        new: true
    })
    if (!product) {
        return next(new Error('product doesnot exist or already soft deleted', { cause: 400 }))
    }
    res.status(200).json({ messaga: "Done", product })
}
