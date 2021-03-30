const { AuthenticationError } = require("apollo-server-errors");
const roomController = require("../../controller/room.controller");
const { formatProperty } = require("../../helpers");

module.exports = {
    Query: {
        rooms: (_, args) => {
            let data = JSON.parse(JSON.stringify(args));
            let newDataSearch = formatProperty(data.query)
            let rooms = roomController.rooms({ ...newDataSearch, page: data.page, per_page: data.per_page })
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

