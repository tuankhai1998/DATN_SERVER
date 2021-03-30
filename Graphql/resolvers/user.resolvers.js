const { AuthenticationError } = require("apollo-server-errors");
const userController = require("../../controller/user.controller")

const { formatProperty } = require("../../helpers")

module.exports = {
    Query: {
        user: (_, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let user = userController.user(context._id)
            return user
        },
        login: (_, args) => {

            let user = userController.login({ email: args.email, password: args.password })
            return user
        },
    },

    Mutation: {
        createUser: async (_, args) => {
            let user = await userController.create({ email: args.email, password: args.password })
            return user
        },

        updateUser: (_, args, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let data = formatProperty(args)
            let userAfterUpdate = userController.update(context._id, data)
            return userAfterUpdate
        },
    }
}
