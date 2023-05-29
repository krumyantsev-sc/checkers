const jwt = require("jsonwebtoken");
const secret = require("../config/config");

const authenticateToken = (token: string) => {
    try {
        const {id: userId} = jwt.verify(token, secret)
        console.log(userId)
        return userId;
    } catch (e) {
        return null;
    }
}

export default authenticateToken;