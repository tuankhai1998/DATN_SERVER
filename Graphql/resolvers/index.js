const { AuthenticationError } = require("apollo-server-errors");
const userController = require("../../controller/user.controller")
const roomController = require("../../controller/room.controller")


const formatProperty = (object) => {
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const element = object[key]
            if (!element) delete object[key]
        }
    }

    return object;
}

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        user: (_, context) => {
            if (!context.isAuth) throw new AuthenticationError("Bạn cần đăng nhập")
            let user = userController.user(context._id)
            return user
        },


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
        // user
        createUser: async (_, args) => {
            let user = await userController.create({ email: args.email, password: args.password })
            return user
        },
        login: (_, args) => {
            let user = userController.login({ email: args.email, password: args.password })
            return user
        },
        updateUser: (_, args, context) => {
            if (!context.isAuth) throw new AuthenticationError("Bạn cần đăng nhập")
            let data = formatProperty(args)
            let userAfterUpdate = userController.update(context._id, data)
            return userAfterUpdate

        },

        // room handle
        createRoom: (_, args, context) => {
            let data = JSON.parse(JSON.stringify(args));
            if (!context.isAuth) throw new AuthenticationError("Bạn cần đăng nhập")
            let roomCreated = roomController.create(context._id, data)
            return roomCreated
        },
        updateRoom: (_, args, context) => {
            let data = JSON.parse(JSON.stringify(args));
            if (!context.isAuth) throw new AuthenticationError("Bạn cần đăng nhập")
            let roomUpdated = {}
            return roomUpdated
        }

    }
}


module.exports = resolvers;