import {TokenExpiredError} from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import {IRole} from "../models/Role";

const jwt = require("jsonwebtoken");
const secret = require("../config/config");

const checkRoleInJWT = (userRole: IRole[], roles, res: Response) => {
    let hasRole = false;
    userRole.forEach(role => {
        if (roles.includes(role)) {
            hasRole = true;
        }
    });
    if (!hasRole) {
        return res.status(403).json({message: "У вас нет доступа"});
    }
}

const checkRole = (roles) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.method === "OPTIONS") {
            next()
        }
        const token: string = req.cookies.jwt;
        console.log("token",token);
        try {
            if (!token) {
                return res.status(200).json({message: "Пользователь не авторизован"});
            }
            const {roles: userRole} = jwt.verify(token, secret);
            checkRoleInJWT(userRole, roles, res);
            next();
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                const payload = jwt.decode(token);
                const newToken = jwt.sign({
                    id: payload.id,
                    roles: payload.roles,
                }, secret, {expiresIn: "24h"});
                res.cookie('jwt', newToken, {
                    httpOnly: true,
                    secure: false,
                });
                checkRoleInJWT(payload.roles, roles, res);
                next();
            }
        }
    }
}

export default checkRole;