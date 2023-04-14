"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("express");
const router = new Router();
const roomController_1 = require("../controllers/roomController");
const cors = require("cors");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
router.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
router.post("/connect", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), roomController_1.default.connect);
router.get("/createRoom", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), roomController_1.default.createRoom);
router.get("/getRoomList", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), roomController_1.default.getRoomList);
router.get("/getLobbyInfo", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), roomController_1.default.getLobbyInfo);
router.get("/getRoomId", (0, roleMiddleware_1.default)(["ADMIN", "USER"]), roomController_1.default.getRoomId);
exports.default = router;
//# sourceMappingURL=roomRouter.js.map