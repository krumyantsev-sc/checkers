import User from "../models/User"
import Role from "../models/Role"
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const secret = require("../config/config")
import { Request, Response } from 'express';
import {IUser} from "../models/User"
import {IRole} from "../models/Role"
import {HydratedDocument} from "mongoose";
const cookieParser = require('cookie-parser');

const generateAccessToken = (id: string, roles: IRole[]): string => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, { expiresIn: "1m" });
};

class authController{
    public check = async (req: Request, res: Response) => {
        try {
            const token: string = req.cookies.jwt;
            if (!token) {
                return res.status(200).json({isAuthenticated: false});
            }
            const payload = jwt.verify(token,secret);
            return res.status(200).json({isAuthenticated: true});
        } catch (e) {
            return res.status(403).json({isAuthenticated: false});
        }
    }

    public registration = async (req: Request, res: Response): Promise<any> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors});
            }
            const {firstName, lastName, email, username, password} = req.body;
            const candidate: IUser = await User.findOne({username});
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"});
            }
            const hashPassword: string = bcrypt.hashSync(password, 7);
            const userRole: IRole = await Role.findOne({value: "USER"});
            const user: HydratedDocument<IUser> = new User(
                {firstName: firstName, lastName: lastName, email: email, username: username, password: hashPassword, role: [userRole.value]});
            await user.save();
            return res.json({message: "Пользователь успешно зарегистрирован"});
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: 'Registration error'});
        }
    }

    public login = async (req: Request, res: Response): Promise<any> => {
        try {
            const {username, password} = req.body;
            const user: IUser = await User.findOne({username});
            if (!user) {
                return res.status(400).json({message: "Пользователь не найден"});
            }
            const validPassword: boolean = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({message: "Неверный пароль"});
            }
            const token: string = generateAccessToken(user._id, user.role);
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: false,
            });
            res.status(200).json({ message: 'Успешная авторизация' });
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: "Login error"});
        }
    }

    public getUsers = async (req: Request, res: Response): Promise<any> => {
        try {
            const users: IUser[] = await User.find();
            res.json(users);
        } catch (e) {
            console.log(e);
        }
    }

    public getUserName = async (req: Request, res: Response): Promise<any> => {
        try {
            const token: string = req.cookies.jwt;
            const { id: userId }: {id: string} = jwt.verify(token, secret) as { id: string };
            const candidate: IUser = await User.findById(userId);
            res.json({ username: candidate?.username });
        } catch (e) {
            console.log(e);
        }
    }
}

export default new authController();