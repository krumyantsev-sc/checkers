"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const associations_1 = require("../pgModels/associations");
const sequelize_1 = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const secret = require("../config/config");
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, { expiresIn: "72h" });
};
class authController {
    constructor() {
        this.logout = (req, res) => {
            res.clearCookie('jwt');
            return res.status(200).json({ message: "Successful logout" });
        };
        this.check = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // try {
            //     const token: string = req.cookies.jwt;
            //     if (!token) {
            //         return res.status(200).json({isAuthenticated: false, isAdmin: false});
            //     }
            //     const payload = jwt.verify(token, secret);
            //     let isAdmin = false;
            //     if (payload.roles.includes("ADMIN")) {
            //         isAdmin = true;
            //     }
            //     return res.status(200).json({isAuthenticated: true, isAdmin: isAdmin});
            // } catch (e) {
            //     return res.status(403).json({isAuthenticated: false});
            // }
        });
        this.registration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Ошибка при регистрации", errors });
                }
                const { firstName, lastName, email, username, password } = req.body;
                const candidate = yield associations_1.default.User.findOne({
                    where: {
                        [sequelize_1.Op.or]: [
                            { username: username },
                            { email: email }
                        ]
                    }
                });
                if (candidate) {
                    return res.status(400).json({ message: "Пользователь с таким именем или email уже существует" });
                }
                const hashPassword = bcrypt.hashSync(password, 7);
                //const userRole: IRole = await Role.findOne({value: "USER"});
                const user = yield associations_1.default.User.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    username: username,
                    password: hashPassword,
                });
                const defaultRole = yield associations_1.default.Role.findOne({ where: { name: "USER" } });
                if (defaultRole) {
                    yield user.addRole(defaultRole);
                }
                return res.json({ message: "Пользователь успешно зарегистрирован" });
            }
            catch (e) {
                console.log(e);
                return res.status(400).json({ message: 'Registration error' });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                //   const user = await User.findOne({username});
                //    if (!user) {
                //        return res.status(400).json({message: "Пользователь не найден"});
                //    }
                //    const validPassword: boolean = bcrypt.compareSync(password, user.password);
                //    if (!validPassword) {
                //        return res.status(400).json({message: "Неверный пароль"});
                //    }
                //    if (user.role.includes("BANNED")) {
                //        return res.status(403).json({message: "Аккаунт заблокирован"});
                //    }
                //    const token: string = generateAccessToken(user._id, user.role);
                //    res.cookie('jwt', token, {
                //        httpOnly: true,
                //        secure: false,
                //    });
                res.status(200).json({ message: 'Успешная авторизация' });
            }
            catch (e) {
                console.log(e);
                return res.status(400).json({ message: "Login error" });
            }
        });
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = 15;
                const skip = (page - 1) * limit;
                // const users = await User.find()
                //     .skip(skip)
                //     .limit(limit)
                //     .sort({_id: -1})
                //     .select('username email role')
                // const totalUsers = await User.countDocuments();
                // const totalPages = Math.ceil(totalUsers / limit);
                // res.json({users, totalPages});
            }
            catch (error) {
                console.error('Ошибка при получении пользователей с пагинацией:', error);
                res.status(500).json({ error: 'Произошла ошибка сервера' });
            }
        });
        this.getUserSearch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // const searchTerm = req.query.searchTerm as string;
            // const regex = new RegExp(`^${searchTerm}`, 'i');
            // const users: IUser[] = await User.find({
            //     $or: [
            //         {username: regex},
            //         {email: regex},
            //     ],
            // })
            //     .select('username email role')
            // res.send(users);
        });
        this.makeAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // const userId: string = req.params.id;
            // const user = await User.findById(userId);
            // const adminRole = await Role.findOne({value: "ADMIN"});
            // if (user.role.includes(adminRole.value)) {
            //     return res.status(409).json({message: "Пользователь уже обладает правами администратора"})
            // }
            // user.role.push(adminRole.value);
            // user.save();
            // return res.status(200).json({message: "Права успешно изменены"});
        });
        this.ban = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // const userId: string = req.params.id;
            // const user = await User.findById(userId);
            // const bannedRole = await Role.findOne({value: "BANNED"});
            // if (user.role.includes(bannedRole.value)) {
            //     return res.status(409).json({message: "Пользователь уже забанен"})
            // }
            // user.role.push(bannedRole.value);
            // user.save();
            // return res.status(200).json({message: "Права успешно изменены"});
        });
        this.getUserName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // try {
            //     const token: string = req.cookies.jwt;
            //     const {id: userId}: { id: string } = jwt.verify(token, secret) as { id: string };
            //     const candidate: IUser = await User.findById(userId);
            //     res.json({username: candidate?.username});
            // } catch (e) {
            //     console.log(e);
            // }
        });
    }
}
exports.default = new authController();
//# sourceMappingURL=authController.js.map