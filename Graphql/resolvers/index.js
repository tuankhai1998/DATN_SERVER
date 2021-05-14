const messagesResolves = require("./messages.resolves");
const roomResolvers = require("./room.resolvers")
const userResolvers = require("./user.resolvers")
const localAddressResolvers = require("./localAddress.resolvers")

const { GraphQLUpload } = require('apollo-server-express');


// Provide resolver functions for your schema fields
const resolvers = {
    FileUpload: GraphQLUpload,
    Query: {
        ...roomResolvers.Query,
        ...userResolvers.Query,
        ...messagesResolves.Query,
        ...localAddressResolvers.Query
    },

    Mutation: {
        ...roomResolvers.Mutation,
        ...userResolvers.Mutation,
        ...messagesResolves.Mutation
    },

    Subscription: {
        ...messagesResolves.Subscription
    }
}


module.exports = resolvers;