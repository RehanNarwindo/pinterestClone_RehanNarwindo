const redisPW = process.env.REDIS_PW;

const Redis = require("ioredis");
const redis = new Redis({
  port: 11111,
  host: "redis-11111.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com",
  username: "default",
  password: redisPW,
  db: 0,
});
module.exports = redis;
