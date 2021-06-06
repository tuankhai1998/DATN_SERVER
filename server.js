const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');

const typeDefs = require('./graphql/typeDef')
const resolvers = require('./graphql/resolvers');
const contextMiddleware = require('./util/contextMiddleware');
const cluster = require('cluster')
const v8 = require('v8');
// require('dotenv').config()

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
        subscriptions: {
            path: '/',
            onConnect: async (connectionParams, webSocket) => {
                console.log('xxx');
                console.log(connectionParams);
            },
        },
        dataSources: () => ({}),
    });
    const app = express();
    server.applyMiddleware({ app });
    app.use(express.static(__dirname + '/public'));
    app.use(cors())

    app.listen({ port: PORT }, () => {
        console.log(`🚀 server ready at http://localhost:${PORT}${server.graphqlPath}`)
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
    })
}
startServer()
// start server


