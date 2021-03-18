const { AuthenticationError } = require("apollo-server-errors");
const roomController = require("../../controller/room.controller")

module.exports = {
    Query: {
        rooms: (_, args) => {
            const { page, per_page } = args;
            let rooms = roomController.rooms(page, per_page)
            return rooms

        },
        room: (_, { _id }) => {
            let room = roomController.currentRoom(_id)
            return room
        }
    },

    Mutation: {
        // room handle
        createRoom: (_, args, context) => {
            let data = JSON.parse(JSON.stringify(args));
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let roomCreated = roomController.create(context._id, data)
            return roomCreated
        },
        updateRoom: (_, args, context) => {
            let data = JSON.parse(JSON.stringify(args));
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let roomUpdated = {}
            return roomUpdated
        },
        deleteRoom: (_, { _id }, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let roomDeleted = roomController.delete(_id, context._id)
            return roomDeleted
        }

    }
}

