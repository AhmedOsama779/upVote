// signUp 
import userModel from "../../../DB/models/user.model.js"
import { sendEmail } from "../../services/sendEmail.js"
import { tokenDecode, tokenGeneration } from "../../utils/tokenFunction.js"
import pkg from 'bcryptjs'


//======================== signUp =======================
export const signUp = async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        gender
    } = req.body
    const emailEixsts = await userModel.findOne({ email }).select('_id email')
    if (emailEixsts) {
        return next(new Error('Email is Already Exists', { cause: 400 }))
    }
    const hashedPass = pkg.hashSync(password, +process.env.SALT_ROUNDS)
    const newUser = new userModel({
        firstName,
        lastName,
        email,
        password: hashedPass,
        gender
    })

    // confimation
    const token = tokenGeneration({ payload: { newUser } })
    if (!token) {
        return next(new Error('Token Generation Fail', { cause: 400 }))
    }
    const confirmationLink =
        `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmEmail/${token}`

    const message = `<a href= ${confirmationLink}>Click to confirm</a>`
    const sentEmail = await sendEmail({
        to: email,
        message,
        subject: "Confirmation Email"
    })
    if (!sentEmail) {
        return next(new Error('Send Email Service Fails', { cause: 400 }))
    }
    // await newUser.save()
    res.status(201).json({ message: "registration success , please confirm your email" })
}

//========================= confirmation Email ==================
export const confirmEmail = async (req, res, next) => {
    const { token } = req.params
    const decode = tokenDecode({ payload: token })
    if (!decode?.newUser) {
        return next(new Error('Decoding Fails', { cause: 400 }))
    }
    decode.newUser.isConfirmed = true
    const confirmedUser = new userModel({
        ...decode.newUser
    })
    await confirmedUser.save()
    return res.status(200).json({ message: "Your email confirmed", decode })
}

//=========================== Login =============================
export const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email, isConfirmed: true })
    if (!user) {
        return next(new Error('Confirm your email', { cause: 400 }))
    }
    const match = pkg.compareSync(password, user.password)
    if (!match) {
        return next(new Error('in-valid login information', { cause: 400 }))
    }
    const token = tokenGeneration({
        payload: {
            _id: user._id,
            email: user.email,
            loggedIn: true
        }
    })
    await userModel.updateOne({ _id: user._id }, { isLoggedIn: true, $inc: { __v: 1 } })
    res.status(200).json({ message: "Login Done", token })
}


// ===================== forget password================
export const foregtPass = async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({ email, isConfirmed: true })
    if (!user) {
        return next(new Error('in-valid email ', { cause: 400 }))
    }
    const token = tokenGeneration({ payload: { _id: user._id } })
    const resetLink =
        `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/resetPass/${token}`
    const message = `<a href= ${resetLink}>Click to reset your password</a>`
    const sentEmail = await sendEmail({
        to: email,
        message,
        subject: "Reset Password Email"
    })
    if (!sentEmail) {
        return next(new Error('Send Email Service Fails', { cause: 400 }))
    }
    res.status(200).json({ message: "Please check your email to reset your password" })
}

//======================= Reset function =================
export const resetPassword = async (req, res, next) => {
    const { token } = req.params
    const { newPassword } = req.body
    const decode = tokenDecode({ payload: token })
    if (! decode?._id) {
        return next(new Error('Decoding Fails', { cause: 400 }))
    }
    const hashedPass = pkg.hashSync(newPassword, +process.env.SALT_ROUNDS)
    const updatedUser = await userModel.findByIdAndUpdate(decode._id, {
        password: hashedPass
    })
    if (!updatedUser) {
        return next(new Error('invalid- id', { cause: 400 }))
    }
    res.status(200).json({ message: "Done,please try to login" })
} 