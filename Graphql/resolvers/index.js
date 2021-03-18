const messagesResolves = require("./messages.resolves");
const roomResolvers = require("./room.resolvers")
const userResolvers = require("./user.resolvers")


// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        ...roomResolvers.Query,
        ...userResolvers.Query,
        ...messagesResolves.Query
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