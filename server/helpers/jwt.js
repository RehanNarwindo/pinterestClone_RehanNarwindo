const jwt = require("jsonwebtoken");
const key = process.env.JWT_SECRET;
function createToken(data) {
  // console.log(data);
  return jwt.sign(data, key);
}
function verifToken(token) {
  return jwt.verify(token, key);
}

module.exports = { createToken, verifToken };
