"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
const checkRoleInJWT = (userRole, roles, res) => {
    let hasRole = false;
    userRole.forEach(role => {
        if (roles.includes(role)) {
            hasRole = true;
        }
    });
    if (!hasRole) {
        return res.status(403).json({ message: "У вас нет доступа" });
    }
};
const checkRole = (roles) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next();
        }
        const token = req.cookies.jwt;
        console.log("token", token);
        try {
            if (!token) {
                return res.status(200).json({ message: "Пользователь не авторизован" });
            }
            const { roles: userRole } = jwt.verify(token, secret);
            checkRoleInJWT(userRole, roles, res);
            next();
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.TokenExpiredError) {
                const payload = jwt.decode(token);
                const newToken = jwt.sign({
                    id: payload.id,
                    roles: payload.roles,
                }, secret, { expiresIn: "24h" });
                res.cookie('jwt', newToken, {
                    httpOnly: true,
                    secure: false,
                });
                checkRoleInJWT(payload.roles, roles, res);
                next();
            }
        }
    };
};
exports.default = checkRole;
//# sourceMappingURL=roleMiddleware.js.map