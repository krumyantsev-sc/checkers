"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
const authenticateToken = (token) => {
    try {
        const { id: userId } = jwt.verify(token, secret);
        console.log(userId);
        return userId;
    }
    catch (e) {
        return null;
    }
};
exports.default = authenticateToken;
//# sourceMappingURL=jwtVerification.js.map