import roleMiddleware from "../middleware/roleMiddleware"
import controller from "../controllers/roomController"

const cors = require("cors");
const Router = require("express");
const router = new Router();

router.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

router.post("/connect", roleMiddleware(["ADMIN", "USER"]), controller.connect);
router.get("/createRoom/:gameName", roleMiddleware(["ADMIN", "USER"]), controller.createRoom);
router.get("/createRoomWithBot/:gameName", roleMiddleware(["ADMIN", "USER"]), controller.createRoomWithBot);
router.get("/getRoomList/:gameName", roleMiddleware(["ADMIN", "USER"]), controller.getRoomList);
router.post("/getLobbyInfo", roleMiddleware(["ADMIN", "USER"]), controller.getLobbyInfo);
router.post("/leave", roleMiddleware(["ADMIN", "USER"]), controller.leaveRoom);

export default router;