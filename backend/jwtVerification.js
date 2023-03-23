const jwt = require("jsonwebtoken");
const {secret} = require("./config/config");
const User = require("./models/User");

function authenticateToken(token) {
    try {
        const payload = jwt.verify(token,secret);
        return payload.id;
    } catch (e) {
        return null;
    }
}

module.exports = {authenticateToken};