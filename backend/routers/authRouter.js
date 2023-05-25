"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const authController_1 = require("../controllers/authController");
const Router = require("express");
const router = new Router();
const { check } = require("express-validator");
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
router.get("/logout", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), authController_1.default.logout);
router.get("/users/search", (0, roleMiddleware_1.default)(["ADMIN"]), authController_1.default.getUserSearch);
router.get("/users/:id/makeAdmin", (0, roleMiddleware_1.default)(["ADMIN"]), authController_1.default.makeAdmin);
router.get("/users/:id/ban", (0, roleMiddleware_1.default)(["ADMIN"]), authController_1.default.ban);
exports.default = router;
//# sourceMappingURL=authRouter.js.map