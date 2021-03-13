const { AuthenticationError } = require("apollo-server-errors");
const userController = require("../../controller/user.controller")


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

    },

    Mutation: {
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
            console.log(args)
            let userAfterUpdate = userController.update(context._id, data)
            return userAfterUpdate

        }
    }
}


module.exports = resolvers;