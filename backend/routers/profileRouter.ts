const Router = require("express");
import controller from "../controllers/userProfileController"
const router = new Router();
import roleMiddleware from "../middleware/roleMiddleware"
const cors = require("cors");

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

router.get("/getAvatar", controller.getProfileAvatar);
router.get("/getProfileInfo", roleMiddleware(["ADMIN", "USER"]), controller.getProfileInfo);

export default router;