var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const secret = require("../config/config");
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, { expiresIn: "24h" });
};
class authController {
    constructor() {
        this.registration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Ошибка при регистрации", errors });
                }
                const { username, password } = req.body;
                const candidate = yield User.findOne({ username });
                if (candidate) {
                    return res.status(400).json({ message: "Пользователь с таким именем уже существует" });
                }
                const hashPassword = bcrypt.hashSync(password, 7);
                const userRole = yield Role.findOne({ value: "USER" });
                const user = new User({ username, password: hashPassword, role: [userRole === null || userRole === void 0 ? void 0 : userRole.value] });
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
                const user = yield User.findOne({ username });
                if (!user) {
                    return res.status(400).json({ message: "Пользователь не найден" });
                }
                const validPassword = bcrypt.compareSync(password, user.password);
                if (!validPassword) {
                    return res.status(400).json({ message: "Неверный пароль" });
                }
                const token = generateAccessToken(user._id, user.role);
                return res.json({ token });
            }
            catch (e) {
                console.log(e);
                return res.status(400).json({ message: "Login error" });
            }
        });
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User.find();
                res.json(users);
            }
            catch (e) {
                console.log(e);
            }
        });
        this.getUserName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                console.log(token);
                const { id: userId } = jwt.verify(token, secret);
                const candidate = yield User.findById(userId);
                res.json({ username: candidate === null || candidate === void 0 ? void 0 : candidate.username });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
module.exports = new authController();
//# sourceMappingURL=authController.js.map