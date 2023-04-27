"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("express");
const authController_1 = require("../controllers/authController");
const router = new Router();
const { check } = require("express-validator");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const cors = require("cors");
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
router.post("/registration", [
    check("username", "Имя пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен быть длиннее 7 символов и короче 15").isLength({ min: 7, max: 15 })
], authController_1.default.registration);
router.post("/login", authController_1.default.login);
router.get("/users", (0, roleMiddleware_1.default)(["ADMIN"]), authController_1.default.getUsers);
router.get("/check", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), authController_1.default.check);
router.get("/getUserName", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), authController_1.default.getUserName);
exports.default = router;
//# sourceMappingURL=authRouter.js.map