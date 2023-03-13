const jwt = require("jsonwebtoken");
const {secret} = require("../config/config");


module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        console.log(roles);
        try {
            const token = req.headers.authorization.split(' ')[1]
            console.log(token);
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }
            const {roles: userRole} = jwt.verify(token, secret)
            let hasRole = false
            console.log(userRole);
            userRole.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })
            if (!hasRole) {
                return res.status(403).json({message: "У вас нет доступа"})
            }
            next();
        } catch (e) {
            console.log(e)
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
};