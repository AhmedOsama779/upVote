import { connectionDB } from "../../DB/connection.js"
import * as allRouters from '../modules/index.routes.js'
import { stackvar } from "./errorHandling.js"

export const initiateApp = (app, express) => {
    const port = process.env.PORT
    const baseUrl = process.env.BASE_URL
    app.use(express.json())
    connectionDB()
    app.use(`${baseUrl}/auth`, allRouters.authRouter)
    app.use(`${baseUrl}/user`, allRouters.userRouter)
    app.use(`${baseUrl}/product`, allRouters.prodRouter)
    app.use(`${baseUrl}/comment`, allRouters.commRouter)
    app.all('*', (req, res) => {
        res.status(404).json({ message: "Page Not Found" })
    })

    app.use((err, req, res, next) => {
        if (err) {
            if (process.env.ENV_MODE == 'dev') {
                return res.status(err['cause'] || 500).json({ message: "Fail Response", Error: err.message, stack: stackvar })
            }
            return res.status(err['cause'] || 500).json({ message: "Fail Response", Error: err.message })
        }
    })
    app.listen(port, () => console.log(`App is Running on ${port} ............`))
}