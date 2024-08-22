const Follow = require("../models/Follow");

const typeDefs = `#graphql
type Follow {
  _id: ID
  followingId: ID
  followerId: ID
}

input FollowInput {
  followingId: ID
}

type Query {
  followers(userId: ID): [Follow]
  following(userId: ID): [Follow]
}

type Mutation {
  follow(input: FollowInput): Follow
}
`;

const resolvers = {
  Query: {
    followers: async (_, args, { auth }) => {
      auth();
      const followers = await Follow.getFollowers(args.userId);
      return followers;
    },
    following: async (parent, args, { auth }) => {
      auth();
      const following = await Follow.getFollowing(args.userId);
      return following;
    },
  },
  Mutation: {
    follow: async (parent, args, contextValue) => {
      const userFollow = contextValue.auth();
      const followData = { ...args.input };
      // console.log(userFollow);
      // console.log(followData);
      const result = await Follow.create(followData, userFollow);
      return result;
    },
  },
};

module.exports = { typeDefs, resolvers };
