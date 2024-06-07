import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js"

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body

        // if password mismatch
        if (password !== confirmPassword) {
            return res.status(400).json({ err: "Passwords don't match" })
        }

        const user = await User.findOne({ username })

        // if user is already exist
        if (user) {
            return res.status(400).json({ err: "Username already exists" })
        }

        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)


        // robot placeholder like https://robohash.org/mail@ashallendesign.co.uk if you ever change your mind ^_^
        const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`


        const newUser = new User({
            fullName,
            username,
            password: hashedPass,
            gender,
            profilePic: gender === "male" ? maleProfilePic : femaleProfilePic
        })

        if (newUser) {

            // generate JWT token for new created user
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({ err: "Invalid user data" })
        }

    } catch (err) {
        console.log("Error in signup controller", err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        const isPassCorrect = bcrypt.compare(password, user?.password || '')

        if (!user || !isPassCorrect) {
            return res.status(400).json({ err: "Invalid username or password" })
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })

    } catch (err) {
        console.log("Error in login controller", err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out Successfully" })
    } catch (err) {
        console.log("Error in logout controller", err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

