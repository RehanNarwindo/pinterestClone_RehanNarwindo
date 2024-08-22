const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class Follow {
  static collection() {
    return database.collection("follows");
  }

  static async create(followData, userFollow) {
    followData.followerId = new ObjectId(String(userFollow.id));
    followData.followingId = new ObjectId(String(followData.followingId));

    const existingFollow = await this.collection().findOne({
      followerId: followData.followerId,
      followingId: followData.followingId,
    });

    if (existingFollow) {
      throw new Error("Follow relationship already exists");
    }

    followData.createdAt = new Date();
    followData.updatedAt = new Date();
    await this.collection().insertOne(followData);
    return followData;
  }

  static async getFollowers(userId) {
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }
    const followers = await this.collection()
      .find({ followingId: new ObjectId(String(userId)) })
      .toArray();
    return followers;
  }

  static async getFollowing(userId) {
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }
    const following = await this.collection()
      .find({ followerId: new ObjectId(String(userId)) })
      .toArray();
    return following.length > 0 ? users[0] : null;
  }
}

module.exports = Follow;
