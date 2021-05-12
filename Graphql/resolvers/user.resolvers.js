const { AuthenticationError } = require("apollo-server-errors");
const path = require('path');
const fs = require('fs');

const userController = require("../../controller/user.controller")

const { formatProperty } = require("../../helpers")

module.exports = {
    Query: {
        user: (_, __, context) => {
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

        updateUser: async (_, args, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let { file } = args;
            const { createReadStream, filename, mimetype, encoding } = await file;

            const stream = createReadStream();
            const pathName = path.join(__dirname, `/public/iamges/${filename}`)
            await stream.pice(fs.createReadStream(pathName))
            let data = await formatProperty(args)
            let userAfterUpdate = await userController.update(context._id, data)
            return userAfterUpdate
        },

        likedRoom: (_, args, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let data = JSON.parse(JSON.stringify(args))
            let userAfterUpdate = userController.liked(context._id, data._idRoom)
            return userAfterUpdate
        }
    }
}
