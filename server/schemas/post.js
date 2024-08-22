const User = require("../models/User");
const Posts = require("../models/Post");
const redis = require("../config/redis");

const typeDefs = `#graphql


type AuthorDetail {
  username: String
  email: String
  _id: ID
}

type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: String
    author: AuthorDetail
    comments:[Comment]
    likes:[Like]
}

type Comment{
  content: String
  username: String
  createdAt: String
  updatedAt: String
}
type Like{
  username: String
  createdAt: String
  updatedAt: String
}

input newPost {
    content: String
    tags: [String]
    imgUrl: String
    authorId: String
}


type Query {
    posts: [Post]
    postById(id: ID): Post

}

type Mutation {
    addPost(content: String, tags:[String],imgUrl:String): Post
    addComment(content:String, postId: ID): String
    addLike(postId: ID): String
}  
`;

const resolvers = {
  Query: {
    posts: async (_, args, { auth }) => {
      auth();
      const postsCache = await redis.get("posts:all");
      if (postsCache) {
        console.log(" cache berarti masuk redist");
        return JSON.parse(postsCache);
      }
      const posts = await Posts.getAll();
      await redis.set("posts:all", JSON.stringify(posts));
      return posts;
    },
    postById: async (parent, args, { auth }) => {
      auth();

      const post = await Posts.findById(args.id);
      return post;
    },
  },

  Mutation: {
    addPost: async (parent, args, contextValue) => {
      const user = contextValue.auth();
      const { content, tags, imgUrl } = args;
      if (!content) throw new Error("Content is required");
      if (!tags) throw new Error("tags is required");
      if (!imgUrl) throw new Error("image Url is required");
      const result = await Posts.create({ content, tags, imgUrl }, user.id);
      await redis.del("posts:all");
      return result;
    },
    addComment: async (_, args, contextValue) => {
      const { content, postId } = args;
      const { username } = contextValue.auth();
      await Posts.addComment({ content, username }, postId);
      return "Success add comment";
    },
    addLike: async (_, args, contextValue) => {
      const { postId } = args;
      const { username } = contextValue.auth();
      await Posts.addLike({ username }, postId);
      return "Success add like";
    },
  },
};

module.exports = { typeDefs, resolvers };
