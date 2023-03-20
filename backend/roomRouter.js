const Router = require("express");
const router = new Router();
const controller = require("./controllers/roomController.js")
const cors = require("cors");
const {io} = require("./index.js")
const authMiddleWare = require("./middleware/authMiddleware")
const roleMiddleware = require("./middleware/roleMiddleware");
router.use(cors({
    origin: ['http://localhost:63342']
}));

router.post("/connect",roleMiddleware(["USER"]), controller.connect);
router.get("/createRoom", roleMiddleware(["ADMIN", "USER"]), controller.createRoom);
router.get("/getRoomList", roleMiddleware(["ADMIN", "USER"]), controller.getRoomList);
router.get("/:lobbyId", controller.createLobbyPage);

module.exports = router