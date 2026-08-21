const jwt = require("jsonwebtoken");
const { accessTokenSecret, jwtExpiresIn } = require("../config/env");

function publicUser(user) {
  return { _id: user._id, fullName: user.fullName, email: user.email, createdOn: user.createdOn };
}

function createAccessToken(userId) {
  return jwt.sign({ sub: userId.toString() }, accessTokenSecret, { expiresIn: jwtExpiresIn });
}

module.exports = { publicUser, createAccessToken };
