const jwt = require("jsonwebtoken");
const {secret} = require("./config/config");
const User = require("./models/User");

function authenticateToken(token) {
    try {
        const {id: userId} = jwt.verify(token, secret)
        return userId;
    } catch (e) {
        return null;
    }
}

module.exports = {authenticateToken};