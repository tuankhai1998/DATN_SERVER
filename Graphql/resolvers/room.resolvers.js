const { AuthenticationError } = require("apollo-server-errors");
const roomController = require("../../controller/room.controller");
const { formatProperty } = require("../../helpers");

const uploadListImage = async (images) => {
    return Promise.all(images.map(async (image) => {
        const { createReadStream, filename, mimetype, encoding } = await image;
        let imageName = `room-${Date.now()}-${filename}`;
        const stream = await createReadStream();
        await storeUpload({ stream, filename: imageName, mimetype, encoding });
    })).then(async function (file_uploaded) {
        const util = require('util')
        console.log("INSPECT 1: " + util.inspect(file_uploaded[0], { showHidden: false, depth: null }))
        console.log("x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x")
        console.log("INSPECT 2: " + util.inspect(file_uploaded[1], { showHidden: false, depth: null }))
    })
}

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
        createRoom: async (_, args, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let data = JSON.parse(JSON.stringify(args));
            const { images } = data.room;

            console.log({ images })
            let listImages = await uploadListImage(images);
            let roomCreated = await roomController.create(context._id, { ...data, images: listImages })
            return roomCreated
        },
        updateRoom: (_, args, context) => {
            let data = JSON.parse(JSON.stringify(args));
            const { images } = data;
            let listImages = [];
            if (avatar) {
                try {
                    images.forEach(async (image) => {
                        const { createReadStream, filename, mimetype, encoding } = await image;
                        let imageName = `room-${Date.now()}-${filename}`;
                        imageNames.push(imageName);
                        const stream = await createReadStream();
                        await storeUpload({ stream, filename: imageName, mimetype, encoding });
                    })

                } catch (error) {
                    console.log(error)
                }
            }
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let roomUpdated = roomController.update({ ...data, images: listImages })
            return roomUpdated
        },
        deleteRoom: (_, { _id }, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let roomDeleted = roomController.delete(_id, context._id)
            return roomDeleted
        }

    }
}

