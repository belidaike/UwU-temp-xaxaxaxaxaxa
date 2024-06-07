import User from "../models/userModel.js"

export const getUsers = async (req, res) => {
    try {

        const loggedInUserId = req.user._id

        const AllUsersButYouAww = await User.find({ _id: { $ne: loggedInUserId } }).select('-password')

        res.status(200).json(AllUsersButYouAww)

    } catch (err) {
        console.log("Error in userControoler: ", err.message)
        res.status(500).json({ err: "Internal server error" })
    }
}