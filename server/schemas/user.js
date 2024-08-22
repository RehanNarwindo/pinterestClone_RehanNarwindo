const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { createToken } = require("../helpers/jwt");

const typeDefs = `#graphql
type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
    follower: [Followers]
    following: [Following]
    followerDetail: [FollowersDetail]
    followingDetail: [FollowingDetail]
}

input NewUser {
    name: String
    username: String
    email: String
    password: String
}
type Followers{
  _id:ID
  followingId: ID
  followerId: ID
}

type Following{
  _id:ID
  followingId: ID
  followerId: ID
}

type FollowersDetail{
  _id:ID
  username: String
  email: String
}

type FollowingDetail{
  _id:ID
  username: String
  email: String
}


type LoginOutput {
    username: String
    token: String
}

input LoginInput {
    username: String
    password: String
}

type Query {
    users: [User]
    userById(id: ID): User
    userByUsername(username: String): User
    userByEmail(email: String): User

}

type Mutation {
    register(newUser: NewUser): User
    login(input: LoginInput): LoginOutput
    
}

`;

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.getAll();
      return users;
    },
    userById: async (parent, args) => {
      const user = await User.findById(args.id);
      return user;
    },
    userByUsername: async (parent, args) => {
      const user = await User.findByUsername(args.username);
      return user;
    },
    userByEmail: async (parent, args) => {
      const user = await User.findByEmail(args.email);
      return user;
    },
  },

  Mutation: {
    register: async (parent, args) => {
      const userBaru = { ...args.newUser };
      if (!userBaru.name) throw new Error("Name is required");
      if (!userBaru.username) throw new Error("Username is required");
      if (!userBaru.email) throw new Error("Email is required");
      if (!userBaru.password) throw new Error("Password is required");
      if (userBaru.password.length < 5)
        throw new Error("Password min 5 Characters");
      var salt = bcrypt.genSaltSync(10);
      userBaru.password = bcrypt.hashSync(userBaru.password, salt);
      const result = await User.create(userBaru);
      return result;
    },
    login: async (parent, args) => {
      const { username, password } = args.input;
      if (!username) {
        throw new Error("Username required");
      }
      if (!password) {
        throw new Error("Password required");
      }
      const user = await User.findByUsername(username);
      if (!user) {
        throw new Error("Invalid Username/Password");
      }
      const passwordNotValid = bcrypt.compareSync(password, user.password);
      if (!passwordNotValid) {
        throw new Error("Invalid Username/Password");
      }
      const access_token = createToken({
        id: user._id,
        username: user.username,
      });
      //   console.log(access_token);
      return {
        username: username,
        token: access_token,
      };
    },
  },
};

module.exports = { typeDefs, resolvers };
