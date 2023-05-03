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

const generateAccessToken = (id: string, roles: Array<IRole | string>): string => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, { expiresIn: "1m" });
};

class authController{
    public logout = (req: Request, res: Response) => {
        res.clearCookie('jwt');
        return res.status(200).json({message: "Successful logout"});
    }

    public check = async (req: Request, res: Response) => {
        try {
            const token: string = req.cookies.jwt;
            if (!token) {
                return res.status(200).json({isAuthenticated: false, isAdmin: false});
            }
            const payload = jwt.verify(token,secret);
            let isAdmin = false;
            if (payload.roles.includes("ADMIN")) {
                isAdmin = true;
            }
            return res.status(200).json({isAuthenticated: true, isAdmin: isAdmin});
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
            const page = parseInt(req.query.page as string) || 1;
            const limit = 15;
            const skip = (page - 1) * limit;
            const users = await User.find()
                .skip(skip)
                .limit(limit)
                .sort({ _id: -1 })
                .select('username email role')
                //.populate('role', 'name');
            const totalUsers = await User.countDocuments();
            const totalPages = Math.ceil(totalUsers / limit);
            res.json({ users, totalPages });
        } catch (error) {
            console.error('Ошибка при получении пользователей с пагинацией:', error);
            res.status(500).json({ error: 'Произошла ошибка сервера' });
        }
    }

    public getUserSearch = async (req: Request, res: Response) => {
        const searchTerm = req.query.searchTerm as string;
        const regex = new RegExp(`^${searchTerm}`, 'i');
        const users: IUser[] = await User.find({
            $or: [
                { username: regex },
                { email: regex },
            ],
        })
            .select('username email role')
        res.send(users);
    }

    public makeAdmin = async (req: Request, res: Response) => {
        const userId: string = req.params.id;
        const user: HydratedDocument<IUser> = await User.findById(userId);
        const adminRole = await Role.findOne({value: "ADMIN"});
        if (user.role.includes(adminRole.value)) {
            return res.status(409).json({message: "Пользователь уже обладает правами администратора"})
        }
        user.role.push(adminRole.value);
        user.save();
        return res.status(200).json({message: "Права успешно изменены"});
    }

    public ban = async (req: Request, res: Response) => {
        const userId: string = req.params.id;
        const user: HydratedDocument<IUser> = await User.findById(userId);
        const bannedRole = await Role.findOne({value: "BANNED"});
        if (user.role.includes(bannedRole.value)) {
           return res.status(409).json({message: "Пользователь уже забанен"})
        }
        user.role.push(bannedRole.value);
        user.save();
        return res.status(200).json({message: "Права успешно изменены"});
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