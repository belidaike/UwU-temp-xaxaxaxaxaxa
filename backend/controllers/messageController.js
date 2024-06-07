import Conversation from "../models/conversationModel.js"
import Message from "../models/messageModel.js"

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        // if no convo yet then create one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id) //newMessage._id is the id of the message_table in db
        }

        // SOCKET IO FUNCTIONALITY WILL GO HERE

        // run the same time
        await Promise.all([await conversation.save(), await newMessage.save()])

        res.status(201).json(newMessage)

    } catch (err) {
        console.log("Error in sendMessage controller: ", err.message)
        res.status(500).json({ err: "Internal server error" })
    }
}
export const getMessages = async (req, res) => {
    try {

        const { id: userToChatId } = req.params
        const senderId = req.user._id
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate("messages")

        if (!conversation) return res.status(200).json([])

        const messages = conversation.messages

        res.status(200).json(conversation.messages)

    } catch (err) {
        console.log("Error in sendMessage controller: ", err.message)
        res.status(500).json({ err: "Internal server error" })
    }
}