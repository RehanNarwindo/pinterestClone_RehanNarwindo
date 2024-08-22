require("dotenv").config();

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const {
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
} = require("./schemas/user");
const {
  typeDefs: postTypeDefs,
  resolvers: postResolvers,
} = require("./schemas/post");
const {
  typeDefs: followTypeDefs,
  resolvers: followResolvers,
} = require("./schemas/follow");
const { verifToken } = require("./helpers/jwt");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: ({ req, res }) => {
    return {
      auth: () => {
        const auth = req.headers.authorization;
        if (!auth) throw new Error("unauthenticated");
        const [type, token] = auth.split(" ");
        if (type !== "Bearer") throw new Error("invalid token");
        const descode = verifToken(token);
        return descode;
      },
    };
  },
}).then(({ url }) => {
  console.log(`server ready at: ${url}`);
});
