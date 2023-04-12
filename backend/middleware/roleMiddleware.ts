const jwt = require("jsonwebtoken");
const secret = require("../config/config");
import {Request, Response, NextFunction} from "express";

const checkRole = (roles) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token: string = req.cookies.jwt;
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"});
            }
            const { roles: userRole } = jwt.verify(token, secret);
            let hasRole = false;
            userRole.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return res.status(403).json({message: "У вас нет доступа"});
            }
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({message: "Пользователь не авторизован"});
        }
    }
}

export default checkRole;