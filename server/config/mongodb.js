const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGGO_DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("pinterest-clone");
module.exports = database;
