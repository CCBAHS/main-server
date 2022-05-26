require('dotenv').config();
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers')
const connectDB = require('./db/connect');
const { ApolloServer } = require("apollo-server");
const { default: axios, AxiosError } = require('axios');


const PORT = process.env.PORT || 5000;
const server = new ApolloServer({
    cors: true,
    typeDefs,
    resolvers,
    context: ({req})=>({req}),
    csrfPrevention: true,
    introspection: true,
})

const start = (uri)=>{
    connectDB(uri);

    server.listen({port: PORT}).then(res => {
        axios.post(process.env.BLOCKCHAIN_URI+"/addNode").then((_)=>{
            console.log(`Server running at ${res.url}`);
        }).catch((err)=>{
            return new AxiosError("Internal Error");
        })
    })
}

start(process.env.MONGODB_URI);