const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDef')
const resolvers = require('./graphql/resolvers');
const contextMiddleware = require('./util/contextMiddleware');
const cluster = require('cluster')
const v8 = require('v8');

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

    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
    })
}

// start server


if (cluster.isMaster) {
    cluster.fork();
    cluster.on('exit', (deadWorker, code, signal) => {
        // Restart the worker
        let worker = cluster.fork();

        // Note the process IDs
        let newPID = worker.process.pid;
        let oldPID = deadWorker.process.pid;

        // Log the event
        console.log('worker ' + oldPID + ' died.');
        console.log('worker ' + newPID + ' born.');

    });
} else { // worker
    const initialStats = v8.getHeapStatistics();

    const totalHeapSizeThreshold =
        initialStats.heap_size_limit * 85 / 100;
    let detectHeapOverflow = () => {
        let stats = v8.getHeapStatistics();
        if ((stats.total_heap_size) > totalHeapSizeThreshold) {
            process.exit();
        }
    };
    setInterval(detectHeapOverflow, 1000);
    // here goes the main logic
    startServer()
}


