const { AuthenticationError } = require("apollo-server-errors");
const roomController = require("../../controller/room.controller");
const { formatProperty } = require("../../helpers");

module.exports = {
    Query: {
        rooms: (_, args) => {
            let data = JSON.parse(JSON.stringify(args));
            let { sortBy, query, page, per_page } = data;
            let newDataSearch = formatProperty(query)
            if (newDataSearch && newDataSearch.addressName) {
                let newAddressName = formatProperty(newDataSearch.addressName);
                newDataSearch.addressName = newAddressName;
            }
            let sort = sortBy && sortBy.map(itemSort => ([`${itemSort.key}`, itemSort.value ? 1 : -1]))
            let rooms = roomController.rooms({ ...newDataSearch, page, per_page, sort })
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
            let room = { ...data.data, price: { ...data.price } }
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let roomUpdated = roomController.update(data._id, room)
            return roomUpdated
        },
        deleteRoom: (_, { _id }, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let roomDeleted = roomController.delete(_id, context._id)
            return roomDeleted
        }

    }
}

