import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/authRoutes.js"
import messageRoute from './routes/messageRoutes.js'
import userRoute from './routes/userRoutes.js'

import connectToMongoDB from "./db/connectToMongoDB.js"

const app = express()
const PORT = process.env.PORT || 5000

dotenv.config()

app.use(express.json()) //to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser()) //to parse the incoming cookies from req.cookies

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoute)
app.use("/api/users", userRoute)

// app.get('/', (req, res) => {
//     res.send('hallo')
// })

app.listen(PORT, () => {
    connectToMongoDB()
    console.log(`Server Running on port ${PORT}`)
})