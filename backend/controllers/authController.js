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
const sequelize_1 = require("sequelize");
const User_1 = require("../pgModels/User");
const Role_1 = require("../pgModels/Role");
const Statistic_1 = require("../pgModels/Statistic");
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
            try {
                const token = req.cookies.jwt;
                if (!token) {
                    return res.status(200).json({ isAuthenticated: false, isAdmin: false });
                }
                const payload = jwt.verify(token, secret);
                let isAdmin = false;
                if (payload.roles.includes("ADMIN")) {
                    isAdmin = true;
                }
                return res.status(200).json({ isAuthenticated: true, isAdmin: isAdmin });
            }
            catch (e) {
                return res.status(403).json({ isAuthenticated: false });
            }
        });
        this.registration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Ошибка при регистрации", errors });
                }
                const { firstName, lastName, email, username, password } = req.body;
                const candidate = yield User_1.User.findOne({
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
                const user = yield User_1.User.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    username: username,
                    password: hashPassword,
                });
                const defaultRole = yield Role_1.Role.findOne({ where: { name: "USER" } });
                if (defaultRole) {
                    yield user.$add('roles', defaultRole);
                }
                yield Statistic_1.Statistic.create({ userId: user.id, wins: 0, loses: 0 });
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
                const user = yield User_1.User.findOne({ where: { username: username } });
                if (!user) {
                    return res.status(400).json({ message: "Пользователь не найден" });
                }
                const validPassword = bcrypt.compareSync(password, user.password);
                if (!validPassword) {
                    return res.status(400).json({ message: "Неверный пароль" });
                }
                const roles = yield user.$get('roles');
                if (roles.some(role => role.name === 'BANNED')) {
                    return res.status(403).json({ message: "Аккаунт заблокирован" });
                }
                const rolesNames = roles.map(role => role.name);
                const token = generateAccessToken(user.id, rolesNames);
                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: false,
                });
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
                const offset = (page - 1) * limit;
                const result = yield User_1.User.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    order: [['id', 'DESC']],
                    attributes: ['id', 'username', 'email'],
                    include: [{
                            model: Role_1.Role,
                            as: 'roles',
                            attributes: ['name'],
                            through: { attributes: [] }
                        }]
                });
                const users = result.rows;
                const totalUsers = result.count;
                const totalPages = Math.ceil(totalUsers / limit);
                res.json({ users, totalPages });
            }
            catch (error) {
                console.error('Ошибка при получении пользователей с пагинацией:', error);
                res.status(500).json({ error: 'Произошла ошибка сервера' });
            }
        });
        this.getUserSearch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const searchTerm = req.query.searchTerm;
            const users = yield User_1.User.findAll({
                where: {
                    [sequelize_1.Op.or]: [
                        { username: { [sequelize_1.Op.iLike]: `${searchTerm}%` } },
                        { email: { [sequelize_1.Op.iLike]: `${searchTerm}%` } }
                    ]
                },
                attributes: ['id', 'username', 'email'],
                include: [{
                        model: Role_1.Role,
                        as: 'roles',
                        attributes: ['name'],
                        through: { attributes: [] },
                    }]
            });
            res.send(users);
        });
        this.makeAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const user = yield User_1.User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            const adminRole = yield Role_1.Role.findOne({ where: { name: 'ADMIN' } });
            if (!adminRole) {
                return res.status(404).json({ message: "Роль ADMIN не найдена" });
            }
            const userRoles = yield user.$get('roles');
            if (userRoles.some(role => role.name === 'ADMIN')) {
                return res.status(409).json({ message: "Пользователь уже обладает правами администратора" });
            }
            yield user.$add('role', adminRole);
            return res.status(200).json({ message: "Права успешно изменены" });
        });
        this.ban = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const user = yield User_1.User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            const bannedRole = yield Role_1.Role.findOne({ where: { name: 'BANNED' } });
            if (!bannedRole) {
                return res.status(404).json({ message: "Роль BANNED не найдена" });
            }
            const userRoles = yield user.$get('roles');
            if (userRoles.some(role => role.name === 'BANNED')) {
                return res.status(409).json({ message: "Пользователь уже забанен" });
            }
            yield user.$add('role', bannedRole);
            return res.status(200).json({ message: "Права успешно изменены" });
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