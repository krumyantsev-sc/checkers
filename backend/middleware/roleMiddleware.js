"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
const checkRole = (roles) => {
    return (req, res, next) => {
        var _a;
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: "Пользователь не авторизован" });
            }
            console.log(roles, typeof roles);
            const { roles: userRole } = jwt.verify(token, secret);
            console.log(roles, typeof roles);
            let hasRole = false;
            console.log("2", roles[0]);
            for (let role in roles) {
                console.log("!", role);
            }
            console.log(typeof userRole);
            console.log(userRole);
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