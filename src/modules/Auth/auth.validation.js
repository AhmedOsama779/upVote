
import joi from 'joi'

export const signUpSchema = {
    body: joi.object().required().keys({
        firstName: joi.string().min(3).max(8).required(),
        lastName: joi.string().min(3).max(8).required(),
        email: joi.string().email().required(),
        password: joi.string().required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        cPass: joi.string().valid(joi.ref('password')),
        gender: joi.string().optional()
    })
}

export const confirmEmailSchema = {
    params: joi.object({ token: joi.string().required() }).required()
}

export const logInSchema = {
    body: joi.object().required().keys({
        email: joi.string().email({ tlds: { allow: ['com', 'net'] } }).required(),
        password: joi.string().required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    })
}