const Router = require("express");
const router = new Router();
import controller from "../controllers/roomController"
const cors = require("cors");
import roleMiddleware from "../middleware/roleMiddleware"
router.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

router.post("/connect",roleMiddleware(["ADMIN", "USER"]), controller.connect);
router.get("/createRoom", roleMiddleware(["ADMIN", "USER"]), controller.createRoom);
router.get("/getRoomList", roleMiddleware(["ADMIN", "USER"]), controller.getRoomList);
router.get("/getLobbyInfo",roleMiddleware(["ADMIN", "USER"]), controller.getLobbyInfo);
router.get("/getRoomId",roleMiddleware(["ADMIN", "USER"]), controller.getRoomId);


export default router;