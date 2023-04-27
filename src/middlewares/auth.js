import userModel from "../../DB/models/user.model.js"
import { asyncHandler } from "../utils/errorHandling.js"
import { tokenDecode } from "../utils/tokenFunction.js"


const authFunction = async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return next(new Error('please login', { cause: 400 }))
    }
    if (!token.startsWith("Amira__")) {
        return next(new Error('Wrong token', { cause: 400 }))
    }
    const separatedToken = token.split('__')[1]
    const decode = tokenDecode({ payload: separatedToken })
    if (!decode?._id) {
        return next(new Error('in-valid token payload', { cause: 400 }))
    }
    const user = await userModel.findById(decode._id)
    if (!user) {
        return next(new Error('user not exists', { cause: 400 }))
    }
    req.user = user
    next()
}

export const auth = () => {
    return asyncHandler(authFunction)
}


//================ authorization ============
export const authorization = (accessRoles) => {
    return (req, res, next) => {
        console.log({ accessRoles });
        const { role } = req.user
        console.log({ role });
        if (!accessRoles.includes(role)) {
            return next(new Error('Un-authorized', { cause: 403 }))
        }
        next()
    }
}