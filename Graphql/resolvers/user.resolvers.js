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

        singleImageUpload: async (_, { file }) => {
            let pathName
            try {
                const { createReadStream, filename, mimetype, encoding } = await file;

                console.log(file)
                const stream = await createReadStream();
                pathName = path.join(__dirname, '../../public/images', filename);
                let writeStream = await fs.createWriteStream(pathName);
                await stream.pipe(writeStream);
            } catch (error) {
                console.log(error)
            }
            return pathName
        },


        updateUser: async (_, args, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let { profile } = args;
            const { avatar } = profile;

            let imageName;
            if (avatar) {
                try {
                    const { createReadStream, filename } = await avatar;
                    imageName = `${Date.now()}-${filename}`;
                    const pathName = path.join(__dirname, '../../public/images', imageName);
                    const stream = await createReadStream();

                    console.log(stream)
                    await stream.pipe(fs.createWriteStream(pathName));
                } catch (error) {
                    console.log(error)
                }
            }
            let data = await formatProperty(profile)
            let userAfterUpdate = await userController.update(context._id, { ...data, avatar: imageName })
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
