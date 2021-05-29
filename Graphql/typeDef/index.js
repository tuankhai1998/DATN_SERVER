const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Query {
        rooms(query: roomSearch, sortBy: [sortBy] ,page: Int, per_page: Int ): [Room]
        user: User
        room (_id: ID!): Room
        login(email: String!, password: String!) : User
        messages(_id: ID!): [Messages]
        localAddress: [localAddress]
        resetPassword(email: String!) : User
    }

    type Mutation {
        createUser(email: String!) : User
        updateUser(profile: userInput) : User
        likedRoom(_idRoom: ID!) : User

        createRoom(room: roomInput ) : Room!
        updateRoom( data: roomInput) : Room!
        deleteRoom(_id: ID!) : User!

        createMessages(to: ID!):  Messages
        sendMessage(data: messagesInput) : Messages
        itRead(_idMessages: ID!) : [Messages]
    }


    type Image {
       url: String!
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
        avatar: String
        phone: String
        name: String
    }

    input roomSearch {
        sex: Int
        type: Int
        roomNum: Int
        peoples: Int
        maxPrice: Int
        minPrice: Int
        addressName: addressNameInput
        longitude: Float
        latitude: Float
        multiDistricts: [String],
        utilities: [Int]
    }

    input sortBy {
        key: String,
        value: Boolean
    }

    input userInput {
        name: String 
        avatar: Upload
        password: String
        newPassword: String
        phone: String
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
        name: String
        type: Int!
        createdAt: String
        acreage: Float
        utilities: [Int]
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
        address: addressInput
        images: [Upload]
        roomNum: Int
        peoples: Int
        hired: Boolean
        acreage: Int
        utilities: [Int]
        price: priceInput
    }

    type Messages {
        contents: [MessageContent],
        from: ID,
        to: ID
    }

    type MessageContent {
        connect: String,
        to: ID,
        read: Boolean,
        created_at: String   
    }

    input messagesInput {
        content: String,
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

