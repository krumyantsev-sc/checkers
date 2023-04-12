"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
const checkRole = (roles) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token = req.cookies.jwt;
            if (!token) {
                return res.status(403).json({ message: "Пользователь не авторизован" });
            }
            const { roles: userRole } = jwt.verify(token, secret);
            let hasRole = false;
            userRole.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return res.status(403).json({ message: "У вас нет доступа" });
            }
            next();
        }
        catch (e) {
            console.log(e);
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }
    };
};
exports.default = checkRole;
//# sourceMappingURL=roleMiddleware.js.map