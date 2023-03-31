const Router = require("express");
const router = new Router();
const controller = require("./controllers/roomController.js")
const cors = require("cors");
const authMiddleWare = require("./middleware/authMiddleware")
const roleMiddleware = require("./middleware/roleMiddleware");
router.use(cors({
    origin: ['http://localhost:63342']
}));

router.post("/connect",roleMiddleware(["ADMIN", "USER"]), controller.connect);
router.get("/createRoom", roleMiddleware(["ADMIN", "USER"]), controller.createRoom);
router.get("/getRoomList", roleMiddleware(["ADMIN", "USER"]), controller.getRoomList);
router.get("/getLobbyInfo",roleMiddleware(["ADMIN", "USER"]), controller.getLobbyInfo);
router.get("/getRoomId",roleMiddleware(["ADMIN", "USER"]), controller.getRoomId);


module.exports = router