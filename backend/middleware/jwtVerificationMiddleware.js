const jwt = require("jsonwebtoken");
const {secret} = require("../config/config");
const User = require("../models/User");


module.exports = function () {
    return async function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            let token = req.body.token;
            console.log(token);
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }
            const {id: userId} = jwt.verify(token, secret)
            const candidate = User.findById(userId).then((res) => console.log(res));
            let temp = await candidate;
            console.log(temp);
            console.log(userId);

            next();
        } catch (e) {
            console.log(e)
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
};