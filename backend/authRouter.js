const Router = require("express");
const controller = require("./controllers/authController.js")
const router = new Router();
const {check} = require("express-validator");
const authMiddleWare = require("./middleware/authMiddleware")
const roleMiddleware = require("./middleware/roleMiddleware")

router.post("/registration", [
    check("username","Имя пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен быть длиннее 7 символов и короче 15").isLength({min:7,max:15})
], controller.registration);
router.post("/login", controller.login);
router.get("/users", roleMiddleware(["ADMIN"]), controller.getUsers);

module.exports = router