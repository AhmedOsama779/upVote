import { Schema, model } from 'mongoose'
import pkg from 'bcryptjs'
import { systemRoles } from '../../src/utils/systemRoles.js'
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        trusted: true
    },
    password: String,
    gender: {
        type: String,
        enum: ['female', 'male']
    },
    profilePic: {
        type: String,
        default: ''
    },
    profilePicPublicId: {
        type: String,
        default: ''
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    covers: [String],
    coverPublicIds: [String],
    role: {
        type: String,
        default: systemRoles.USER,
        enum: [systemRoles.USER, systemRoles.ADMIN, systemRoles.SUPER_ADMIN]
    }
})

// hooks 
// userSchema.pre('save', function (next, doc) {
//     this.password = pkg.hashSync(this.password, +process.env.SALT_ROUNDS)
//     next()
// })

// model
const userModel = model.User || model('User', userSchema)

export default userModel