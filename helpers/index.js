const roomModel = require("../model/room.model")
const userModel = require("../model/user.model")
const messageModel = require("../model/message.model")

const getUserCreated = async (userID) => {
    try {
        let user = await userModel.findById({ _id: userID })
        return { ...user._doc, created: () => getRoom(user._doc.created) }
    } catch (error) {
        throw error
    }
}


const getRoom = async (roomIds) => {
    try {
        let rooms = await roomModel.find({ _id: { $in: roomIds } })
        return rooms.map(room => ({
            ...room._doc,
            createdBy: () => getUserCreated(room._doc.createdBy)
        }))
    } catch (error) {
        throw new Error(`get room ${error}`)
    }
}

const formatProperty = (object) => {
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const element = object[key]
            if (!element && typeof element !== 'number') delete object[key]
        }
    }

    return object;
}

const getMessagesOfChatRoom = async (messagesID) => {
    try {
        let messages = await messageModel.find({ _id: messagesID })
        return messages.map(message => ({
            ...message._doc,
            user: () => getUserSendMessage(message._doc.user)
        }))
    } catch (error) {
        throw new Error(`get message ${error}`)
    }
}

const getUserSendMessage = async (userID) => {
    try {
        let user = await userModel.findById({ _id: userID })
        return {
            ...user._doc,
            password: null,
            refreshToken: null
        }
    } catch (error) {

        throw error
    }
}

const getMembers = async (listUserID) => {
    try {
        let users = await userModel.find({ _id: { $in: listUserID } })
        return users.map((user) => (
            { ...user._doc, created: () => getRoom(user._doc.created) }
        ))
    } catch (error) {
        throw error
    }
}


const getLastMessage = async (messageID) => {
    try {
        let message = await messageModel.findById({ _id: messageID })
        return {
            ...message._doc,
            user: () => getUserSendMessage(message._doc.user)
        }
    } catch (error) {
        throw new Error(`get message ${error}`)
    }
}

const convertCityName = (cityCode) => {
    if (cityCode == 1) return 'Hồ Chí Minh'
    if (cityCode == 2) return 'Hà Nội'
    return 'Đà Nẵng'
}

module.exports = {
    getUserCreated,
    getRoom,
    formatProperty,
    getMessagesOfChatRoom,
    getUserSendMessage,
    getMembers,
    getLastMessage,
    convertCityName
}






