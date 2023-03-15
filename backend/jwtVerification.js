const jwt = require("jsonwebtoken");
const {secret} = require("./config/config");
const User = require("./models/User");

function authenticateToken(token) {
    try {
        const payload = jwt.verify(token,secret);
        if (payload.exp > Math.floor(Date.now()/1000)) {
            return payload.id;
        }
        return null;
    } catch (e) {
        return null;
    }
}

module.exports = {authenticateToken};