import mongoose from "mongoose"



export const connectionDB = async () => {
    return await mongoose
        .connect(process.env.DB_URL_LOCAL)
        .then((res) => console.log("DB connection success"))
        .catch((err) => console.log({ message: "DB connection fail", Error: err }))
}