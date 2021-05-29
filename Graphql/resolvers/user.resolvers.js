const { AuthenticationError } = require("apollo-server-errors");


const userController = require("../../controller/user.controller")
const { formatProperty } = require("../../helpers")
const storeUpload = require("../../helpers/storeUpload")



const generatePassword = () => {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}



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

        resetPassword: async (_, args) => {
            let password = await generatePassword();
            let user = await userController.resetPassword({ email: args.email, password })
            return user
        },

    },

    Mutation: {
        createUser: async (_, args) => {
            let password = await generatePassword();
            let user = await userController.create({ email: args.email, password })
            return user
        },

        updateUser: async (_, args, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let { profile } = args;
            const { avatar } = profile;
            let imageName;
            if (avatar) {
                try {
                    const { createReadStream, filename, mimetype, encoding } = await avatar;
                    imageName = `avatar-${Date.now()}-${filename}`;
                    const stream = await createReadStream();
                    await storeUpload({ stream, filename: imageName, mimetype, encoding });

                } catch (error) {
                    console.log(error)
                }
            }
            let newData = { ...profile, avatar: imageName }
            let data = await formatProperty(newData)
            let userAfterUpdate = await userController.update(context._id, { ...data })
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
