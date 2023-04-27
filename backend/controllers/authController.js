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
const User_1 = require("../models/User");
const Role_1 = require("../models/Role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const secret = require("../config/config");
const cookieParser = require('cookie-parser');
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, { expiresIn: "1m" });
};
class authController {
    constructor() {
        this.check = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.jwt;
                if (!token) {
                    return res.status(200).json({ isAuthenticated: false });
                }
                const payload = jwt.verify(token, secret);
                return res.status(200).json({ isAuthenticated: true });
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
                const candidate = yield User_1.default.findOne({ username });
                if (candidate) {
                    return res.status(400).json({ message: "Пользователь с таким именем уже существует" });
                }
                const hashPassword = bcrypt.hashSync(password, 7);
                const userRole = yield Role_1.default.findOne({ value: "USER" });
                const user = new User_1.default({ firstName: firstName, lastName: lastName, email: email, username: username, password: hashPassword, role: [userRole.value] });
                yield user.save();
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
                const user = yield User_1.default.findOne({ username });
                if (!user) {
                    return res.status(400).json({ message: "Пользователь не найден" });
                }
                const validPassword = bcrypt.compareSync(password, user.password);
                if (!validPassword) {
                    return res.status(400).json({ message: "Неверный пароль" });
                }
                const token = generateAccessToken(user._id, user.role);
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
                const users = yield User_1.default.find();
                res.json(users);
            }
            catch (e) {
                console.log(e);
            }
        });
        this.getUserName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.jwt;
                const { id: userId } = jwt.verify(token, secret);
                const candidate = yield User_1.default.findById(userId);
                res.json({ username: candidate === null || candidate === void 0 ? void 0 : candidate.username });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.default = new authController();
//# sourceMappingURL=authController.js.map