const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class User {
  static collection() {
    return database.collection("users");
  }
  static async getAll() {
    const agg = [
      {
        $match: {
          _id: new ObjectId(String(_id)),
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingId",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followers.followingId",
          foreignField: "_id",
          as: "followersDetail",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followerId",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "followerDetail",
        },
      },
    ];

    const users = await this.collection().aggregate(agg).toArray();
    return users;
  }
  static async create(userBaru) {
    if (!userBaru.username) throw new Error("Username is required");
    if (!userBaru.email) throw new Error("Email is required");
    if (!userBaru.password) throw new Error("Password is required");
    if (userBaru.password.length < 5)
      throw new Error("Password min 5 Characters");

    const checkEmail = await this.findByEmail(userBaru.email);
    if (checkEmail) throw new Error("Email must be unique");

    const checkUsername = await this.findByUsername(userBaru.username);
    if (checkUsername) throw new Error("Username must be unique");

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(userBaru.email)) {
      throw new Error("Invalid email format");
    }

    userBaru.createdAt = new Date();
    userBaru.updatedAt = new Date();
    await this.collection().insertOne(userBaru);
    return userBaru;
  }

  static async findByEmail(email) {
    const result = await database.collection("users").findOne({
      email: email,
    });
    return result;
  }
  static async findByUsername(username) {
    if (!username) {
      throw new Error("Username is required");
    }

    const agg = [
      {
        $match: {
          username: username,
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingId",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following.followerId",
          foreignField: "_id",
          as: "followingDetail",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followerId",
          as: "follower",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "follower.followingId",
          foreignField: "_id",
          as: "followerDetail",
        },
      },
    ];
    const users = await this.collection().aggregate(agg).toArray();

    return users.length > 0 ? users[0] : null;
  }

  static async findById(_id) {
    if (!ObjectId.isValid(_id)) {
      throw new Error("Invalid user ID format");
    }

    const agg = [
      {
        $match: {
          _id: new ObjectId(String(_id)),
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingId",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following.followerId",
          foreignField: "_id",
          as: "followingDetail",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followerId",
          as: "follower",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "follower.followingId",
          foreignField: "_id",
          as: "followerDetail",
        },
      },
    ];
    const users = await this.collection().aggregate(agg).toArray();
    // console.log(users);
    // console.log(users.followers);

    return users.length > 0 ? users[0] : null;

    // const user = await this.collection().findOne({
    //   _id: new ObjectId(String(_id)),
    // });
    // return user;
  }
}

module.exports = User;
