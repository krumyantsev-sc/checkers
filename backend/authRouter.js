const Router = require("express");
const controller = require("./controllers/authController")
const router = new Router();
const {check} = require("express-validator");
const authMiddleWare = require("./middleware/authMiddleware")
import roleMiddleware from "./middleware/roleMiddleware"
const cors = require("cors");

router.use(cors({
    origin: ['http://localhost:63342']
}));

router.post("/registration", [
    check("username","Имя пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен быть длиннее 7 символов и короче 15").isLength({min:7,max:15})
],controller.registration);
router.post("/login",controller.login);
router.get("/users", roleMiddleware(["ADMIN"]),controller.getUsers);
router.get("/getUserName", roleMiddleware(["ADMIN", "USER"]),controller.getUserName);

module.exports = router