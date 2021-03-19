const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDef')
const resolvers = require('./graphql/resolvers');
const contextMiddleware = require('./util/contextMiddleware');


async function startServer() {
    // connect database
    try {
        await mongoose.connect('mongodb://localhost:27017/AHome', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        console.log("🚀 Connected database success !🚀")
    } catch (error) {
        console.log(error)
    }

    // create server
    PORT = process.env.PORT || 5000;
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: contextMiddleware,
        subscriptions: { path: '/' }
    });
    const app = express();
    server.applyMiddleware({ app });
    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
    })
}

// start server
startServer()
