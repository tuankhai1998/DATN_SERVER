const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Query {
        rooms(query: roomSearch, sortBy: [sortBy] ,page: Int, per_page: Int ): [Room]
        user: User
        room (_id: ID!): Room
        login(email: String!, password: String!) : User
        messages(form: ID!): [Messages]
        localAddress: [localAddress]
    }

    type Mutation {
        createUser(email: String!, password: String!) : User
        updateUser(email: String, avatar: String , password: String) : User
        likedRoom(_idRoom: ID!) : User

        createRoom(room: roomInput!, price: priceInput ) : Room!
        updateRoom(_id: ID!, data: roomInput, price: priceInput) : Room!
        deleteRoom(_id: ID!) : User!

        sendMessage(data: messagesInput) : Messages
        itRead(from: ID!, to: ID!) : [Messages]
    }

    type Subscription {
        newMessage: Messages!
        readMessage: [Messages]
    }

    type User {
        email: String
        token: String
        _id: ID!
        refreshToken: String
        expiresIn: Int
        created: [Room]
        liked: [Room]
    }

    input roomSearch {
        sex: Int
        type: Int
        roomNum: Int
        peoples: Int
        maxPrice: Int
        addressName: addressNameInput
        longitude: Float
        latitude: Float
        multiDistricts: [String]
    }

    input sortBy {
        key: String,
        value: Boolean
    }

    input userInput {
        email: String 
        avatar: String
        password: String
    }

    type Room {
        _id: ID!
        sex: Int!
        createdBy: User!
        address: Address
        images: [String]!
        price: Price!
        roomNum: Int!
        peoples: Int!
        hired: Boolean
        type: Int!
        createdAt: String
    }

    type Address {
        loc: loc
        name: addressName
    }

    input locInput{
        coordinates: [Float]
    }

    type loc{
        coordinates: [Float]
    }
   
    type addressName {
        city: String,
        districts: String,
        wardsAndStreet: String,
        any: String
    }

    input addressNameInput {
        city: String,
        districts: String,
        wardsAndStreet: String,
        any: String
    }

    type Price {
        water: currentPriceOutput
        electricity: currentPriceOutput
        room: currentPriceOutput
        internet: currentPriceOutput
    }

    input currentPrice {
        free: Boolean
        price: Int
    }

    type currentPriceOutput {
        free: Boolean
        price: Int
    }

    
    input addressInput {
        loc: locInput
        name: addressNameInput
    }

    input priceInput {
        water: currentPrice
        electricity: currentPrice
        room: currentPrice
        internet: currentPrice
    }

    input roomInput {
        sex: Int
        type: Int
        createdBy: ID
        address: addressInput
        images: [String]
        roomNum: Int
        peoples: Int
        hired: Boolean
    }

    type Messages {
        content: String,
        from: ID,
        to: ID,
        read: Boolean,
        created_at: String       
    }

    input messagesInput {
        content: String,
        from: ID,
        to: ID,
        read: Boolean,
    }

    type localAddress {
        code: String,
        name: String,
        districts: [Districts]
    }

    type streetsOrWards {
        name: String,
        prefix: String
    }

    type Districts {
        name: String,
        streets: [streetsOrWards],
        wards: [streetsOrWards]
    }

`;

module.exports = typeDefs;

