import userModel from "../../../DB/models/user.model.js"
import cloudinary from "../../utils/cloudinary.js"
import bc from 'bcryptjs'


//=============================== add Profile pciture ==================
export const addProfile = async (req, res, next) => {
    const { _id, firstName } = req.user
    if (!req.file) {
        return next(new Error('select your picture', { cause: 400 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `profiles/${firstName}`
    })
    const user = await userModel.findByIdAndUpdate(_id, {
        profilePic: secure_url,
        profilePicPublicId: public_id
    })
    // user.profilePicPublicId
    const data = await cloudinary.uploader.destroy(user.profilePicPublicId)
    console.log(data);
    res.status(200).json({ message: "Done" })
}

//======================= cover pictures =================
export const addCover = async (req, res, next) => {
    const { _id, firstName } = req.user
    if (!req.files.length) {
        return next(new Error('select your pictures', { cause: 400 }))
    }
    let images = [];
    let publicIDsArr = []
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `Covers/${firstName}`
        })
        images.push(secure_url)
        publicIDsArr.push(public_id)
    }
    const user = await userModel.findByIdAndUpdate(_id, {
        covers: images,
        coverPublicIds: publicIDsArr
    })
    const data = await cloudinary.api.delete_resources(user.coverPublicIds)
    console.log(data);
    res.status(200).json({ message: "Done" })
}

//========================== Update Password  ========================
export const updatePassword = async (req, res, next) => {
    const { _id } = req.user
    const { oldPass, newPass } = req.body
    const user = await userModel.findById(_id)
    if (!user) {
        return next(new Error('please try to login again', { cause: 400 }))
    }
    const match = bc.compareSync(oldPass, user.password)
    if (!match) {
        return next(new Error('wrong old password', { cause: 400 }))
    }
    const hashedPass = bc.hashSync(newPass, +process.env.SALT_ROUNDS)
    const userUpdated = await userModel.findByIdAndUpdate(_id, {
        password: hashedPass
    })
    if (!userUpdated) {
        return next(new Error('please try to login again', { cause: 400 }))
    }
    res.status(200).json({ message: "Done" })
}