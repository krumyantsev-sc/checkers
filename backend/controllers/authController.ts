import User from "../models/User"
const Role = require("../models/Role")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const secret = require("../config/config")


const generateAccessToken = (id: string, roles: string[]): string => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
    public registration = async (req: any, res: any) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors});
            }
            const {username, password} = req.body;
            const candidate = await User.findOne({username});
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"});
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"});
            const user = new User({username, password: hashPassword, role: [userRole.value]});
            await user.save();
            return res.json({message: "Пользователь успешно зарегистрирован"});
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: 'Registration error'});
        }
    }

    public login = async (req: any, res: any) => {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username});
            console.log(user);
            if (!user) {
                return res.status(400).json({message: "Пользователь не найден"});
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({message: "Неверный пароль"});
            }
            const token = generateAccessToken(user._id, user.role);
            return res.json({token});
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: "Login error"});
        }
    }

    public getUsers = async (req: any, res: any) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
            console.log(e);
        }
    }

    public getUserName = async (req: any, res: any) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const { id: userId } = jwt.verify(token, secret) as { id: string };
            const candidate = await User.findById(userId);
            res.json({ username: candidate?.username });
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new authController();