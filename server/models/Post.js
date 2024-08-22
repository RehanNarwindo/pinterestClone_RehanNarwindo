const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");
const redis = require("../config/redis");
class Posts {
  static collection() {
    return database.collection("posts");
  }
  static async getAll() {
    //	pasang redist di getAll post, untuk optimize aplikasi kita;
    // cek apakah redist sudah ada isinya apa belum
    // await redis.connect();

    // 1. all post -> di redist ada atau tidak
    // 2. jika ada langsung ambil di redist
    // 3. jika tidak ada maka kita ambil ke mongoDB -> simpan ke redits
    const agg = [
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];

    const posts = await this.collection().aggregate(agg).toArray();

    // await redis.set("posts:all", JSON.stringify(posts));
    return posts;
  }
  static async create(postBaru, authorId) {
    postBaru.authorId = new ObjectId(String(authorId));
    postBaru.createdAt = new Date();
    postBaru.updatedAt = new Date();
    await this.collection().insertOne(postBaru);

    // 4. ketika berhasil create, maka hapus yang ada dalam redist
    // await redis.del("posts:all");

    return postBaru;
  }
  static async findById(_id) {
    const agg = [
      {
        $match: { _id: new ObjectId(String(_id)) },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];

    const post = await this.collection().aggregate(agg).toArray();
    return post.length > 0 ? post[0] : null;
  }
  static async addComment(payload, postId) {
    payload.createdAt = new Date();
    payload.updatedAt = new Date();
    await database.collection("posts").updateOne(
      {
        _id: new ObjectId(String(postId)),
      },
      {
        $push: {
          comments: payload,
        },
      }
    );
    return "Success";
  }
  static async addLike(payload, postId) {
    const post = await database.collection("posts").findOne({
      _id: new ObjectId(String(postId)),
      "likes.username": payload.username,
    });

    if (post) {
      return "User has already liked this post";
    }
    payload.username = payload.username;
    payload.createdAt = new Date();
    payload.updatedAt = new Date();
    // console.log(payload);
    await database.collection("posts").updateOne(
      {
        _id: new ObjectId(String(postId)),
      },
      {
        $push: {
          likes: payload,
        },
      }
    );
    return "Success Like";
  }
}

module.exports = Posts;
