import roleMiddleware from "../middleware/roleMiddleware"
import controller from "../controllers/userProfileController"

const Router = require("express");
const router = new Router();
const cors = require("cors");

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

router.get("/getAvatar", roleMiddleware(["USER", "ADMIN"]), controller.getProfileAvatar);
router.get("/getProfileInfo", roleMiddleware(["ADMIN", "USER"]), controller.getProfileInfo);
router.post('/update-profile', controller.upload.single('avatar'), controller.updateProfile);
router.get("/getHistory", roleMiddleware(["USER", "ADMIN"]), controller.getMatchHistory);
router.get("/:id", roleMiddleware(["ADMIN"]), controller.getInfoById);

export default router;