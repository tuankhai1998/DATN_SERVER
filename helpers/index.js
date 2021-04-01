const roomModel = require("../model/room.model")
const userModel = require("../model/user.model")

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
            if (!element) delete object[key]
        }
    }

    return object;
}


module.exports = {
    getUserCreated,
    getRoom,
    formatProperty
}






