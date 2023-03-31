const Router = require("express");
const controller = require("./controllers/authController")
const router = new Router();
const {check} = require("express-validator");
const authMiddleWare = require("./middleware/authMiddleware")
const roleMiddleware = require("./middleware/roleMiddleware")
const cors = require("cors");

router.use(cors({
    origin: ['http://localhost:63342']
}));

router.post("/registration", [
    check("username","Имя пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен быть длиннее 7 символов и короче 15").isLength({min:7,max:15})
], (req,res) => controller.registration(req,res));
router.post("/login", (req,res) => controller.login(req,res));
router.get("/users", roleMiddleware(["ADMIN"]),(req,res) => controller.getUsers(req,res));
router.get("/getUserName", roleMiddleware(["ADMIN", "USER"]),(req,res) => controller.getUserName(req,res));

module.exports = router