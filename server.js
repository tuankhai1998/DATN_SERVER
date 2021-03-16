const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDef')
const resolvers = require('./graphql/resolvers')

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
        context: ({ req }) => {
            const authHeader = req.headers.authorization;
            if (!authHeader) return { isAuth: false }

            let token = authHeader.split(" ")[1]

            if (!token || token === "") return { isAuth: false }

            let decodedToken
            try {
                decodedToken = jwt.verify(token, process.env.TOKEN_PASSWORD)
            } catch (error) {
                throw new Error(error)
            }
            return { ...decodedToken, isAuth: true }
        }
    });
    const app = express();
    server.applyMiddleware({ app });


    app.listen({ port: PORT }, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    });
}

// start server
startServer()
