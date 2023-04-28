const Router = require("express");
import controller from "../controllers/userProfileController"
const router = new Router();
import roleMiddleware from "../middleware/roleMiddleware"
const cors = require("cors");

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

router.get("/getAvatar",roleMiddleware(["USER", "ADMIN"]), controller.getProfileAvatar);
router.get("/getProfileInfo", roleMiddleware(["ADMIN", "USER"]), controller.getProfileInfo);
router.post('/update-profile', controller.upload.single('avatar'), controller.updateProfile);
router.get("/getHistory", roleMiddleware(["USER", "ADMIN"]), controller.getMatchHistory);

export default router;