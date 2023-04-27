

let stackvar;
export const asyncHandler = (API) => {
    return (req, res, next) => {
        API(req, res, next).catch((err) => {
            if (err.code == 11000) {
                return next(new Error('Email is Already exist', { cause: 409 }))
            }
            stackvar = err.stack
            return next(new Error(err.message))
        })
    }
}

export {
    stackvar
}
