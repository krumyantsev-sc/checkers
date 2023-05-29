"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const roomController_1 = require("../controllers/roomController");
const cors = require("cors");
const Router = require("express");
const router = new Router();
router.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
router.post("/connect", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), roomController_1.default.connect);
router.get("/createRoom/:gameName", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), roomController_1.default.createRoom);
router.get("/createRoomWithBot/:gameName", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), roomController_1.default.createRoomWithBot);
router.get("/getRoomList/:gameName", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), roomController_1.default.getRoomList);
router.post("/getLobbyInfo", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), roomController_1.default.getLobbyInfo);
router.post("/leave", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), roomController_1.default.leaveRoom);
exports.default = router;
//# sourceMappingURL=roomRouter.js.map