import {TokenExpiredError} from "jsonwebtoken";
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
import {Request, Response, NextFunction} from "express";
import {IRole} from "../models/Role";

const checkRoleInJWT = (userRole: IRole[], roles, res: Response) => {
    console.log(userRole, roles);
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
        console.log('vhod')
        if (req.method === "OPTIONS") {
            next()
        }
        const token: string = req.cookies.jwt;
        try {

            console.log(token)
            if (!token) {
                return res.status(200).json({message: "Пользователь не авторизован"});
            }
            const { roles: userRole } = jwt.verify(token, secret);
            checkRoleInJWT(userRole,roles,res);
                console.log(userRole);
                next();
            } catch (e) {
                if (e instanceof TokenExpiredError) {
                    console.log("expired")
                    const payload = jwt.decode(token);
                    const newToken = jwt.sign({
                        id: payload.id,
                        roles: payload.roles,
                    }, secret, { expiresIn: "24h" });
                    console.log(newToken);
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