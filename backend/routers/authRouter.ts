const Router = require("express");
import controller from "../controllers/authController"
const router = new Router();
const {check} = require("express-validator");
import roleMiddleware from "../middleware/roleMiddleware"
const cors = require("cors");

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

router.post("/registration", [
    check("username","Имя пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен быть длиннее 7 символов и короче 15").isLength({min:7,max:15})
],controller.registration);
router.post("/login",controller.login);
router.get("/users", roleMiddleware(["ADMIN"]),controller.getUsers);
router.get("/check", roleMiddleware(["ADMIN", "USER"]),controller.check);
router.get("/getUserName", roleMiddleware(["ADMIN", "USER"]),controller.getUserName);
router.get("/logout", roleMiddleware(["ADMIN", "USER"]), controller.logout);
router.get("/users/search", roleMiddleware(["ADMIN"]), controller.getUserSearch);
router.get("/users/:id/makeAdmin", roleMiddleware(["ADMIN"]), controller.makeAdmin);
router.get("/users/:id/ban", roleMiddleware(["ADMIN"]), controller.ban);

export default router;