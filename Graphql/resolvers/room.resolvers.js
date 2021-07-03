const { AuthenticationError } = require("apollo-server-errors");
const roomController = require("../../controller/room.controller");
const { formatProperty } = require("../../helpers");
const storeUpload = require("../../helpers/storeUpload");

const uploadListImage = async (images) => {
    let listImages = []
    try {
        await Promise.all(images.map(async (image) => {
            const { createReadStream, filename, mimetype, encoding } = await image;
            let imageName = `room-${Date.now()}-${filename}`;
            const stream = await createReadStream();
            await storeUpload({ stream, filename: imageName, mimetype, encoding });
            listImages.push(imageName)
        }))
    } catch (error) {
        console.log(error)
    }
    return listImages
}

module.exports = {
    Query: {
        rooms: (_, args) => {
            let data = JSON.parse(JSON.stringify(args));
            let { sortBy, query, page, per_page } = data;
            console.log(args)
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
        },
        deleteRoom: (_, { _id }, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let roomDeleted = roomController.delete(_id, context._id)
            return roomDeleted
        }
    },

    Mutation: {
        // room handle
        createRoom: async (_, args, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            const { images } = args.room;
            /*
            let listImages = images.filter(image => typeof (image) !== 'string')
            */
            let listImages = await uploadListImage(images);
            let roomCreated = await roomController.create(context._id, { ...args.room, images: listImages })
            return roomCreated
        },
        updateRoom: async (_, args, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            const { images } = args.room;
            let listImages = args.imagesName;
            let listImagesUpload = images && images.length > 0 ? await uploadListImage(images) : [];
            let roomUpdated = await roomController.update({ ...args.room, images: [...listImages, ...listImagesUpload], _id: args._id });
            return roomUpdated
        },


    }
}

