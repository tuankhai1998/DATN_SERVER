const messagesResolves = require("./messages.resolves");
const roomResolvers = require("./room.resolvers")
const userResolvers = require("./user.resolvers")

const { GraphQLUpload } = require('apollo-server-express');


// Provide resolver functions for your schema fields
const resolvers = {
    Upload: GraphQLUpload,
    // MessageContent: {
    //     createdAt: (parent) => {
    //         let now = Date.now();
    //         let { createdAt } = parent;

    //         let millisBetween = now - createdAt;

    //         if (millisBetween < 1000 * 3600) return `${(millisBetween / (3600 * 1000) * 60).toFixed(0)} minutes ago`
    //         if (millisBetween < 1000 * 3600 * 24) return `${(millisBetween / (1000 * 3600)).toFixed(0)} hours ago`

    //         return `${(millisBetween / (1000 * 3600 * 24)).toFixed(0)} days ago`
    //     }
    // },

    Query: {
        ...roomResolvers.Query,
        ...userResolvers.Query,
        ...messagesResolves.Query,
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