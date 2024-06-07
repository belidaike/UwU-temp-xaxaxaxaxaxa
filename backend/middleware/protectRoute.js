import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        // if no token return no token
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" })
        }

        // if token decode
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // if not decoded return have token however invalid token
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" })
        }

        // if all good find and remove password
        const user = await User.findById(decoded.userId).select('-password')

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        req.user = user

        next()

    } catch (err) {
        console.log("Error in protectRoute middleware: ", err.message)
        res.status(500).json({ err: "Internal server error" })
    }
}
export default protectRoute
